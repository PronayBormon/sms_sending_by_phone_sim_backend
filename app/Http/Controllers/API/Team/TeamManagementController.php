<?php

namespace App\Http\Controllers\API\Team;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\TeamActivityLog;
use App\Models\TeamMember;
use App\Models\User;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class TeamManagementController extends Controller
{
    use ApiResponse;

    private int $teamId;
    private TeamMember $membership;

    public function __construct()
    {
        $auth = Auth::user();
        abort_if(!$auth || $auth->teams->isEmpty(), 404, 'Team not found.');

        $team            = $auth->teams->first();
        $this->teamId    = $team->id;
        $this->membership = TeamMember::where('team_id', $this->teamId)
            ->where('user_id', $auth->id)
            ->firstOrFail();
    }

    /**
     * GET /api/v1/team/members
     * List all members with their user info, role, status, and last active.
     */
    public function members(): JsonResponse
    {
        return $this->respondSafely(function () {
            $team = Auth::user()->teams->first()->load('creator:id,name,email,avatar');

            $members = TeamMember::where('team_id', $this->teamId)
                ->with('user:id,name,email,avatar')
                ->get()
                ->map(function (TeamMember $member) use ($team) {
                    return [
                        'id'            => $member->id,
                        'user_id'       => $member->user_id,
                        'name'          => $member->user?->name ?? $member->invited_email,
                        'email'         => $member->user?->email ?? $member->invited_email,
                        'avatar'        => $member->user?->avatar,
                        'role'          => $member->role,
                        'status'        => $member->status,
                        'last_active'   => $member->last_active_at,
                        'is_owner'      => $member->user_id === $team->creator_id,
                    ];
                });

            return $this->successResponse('Team members retrieved.', [
                'team'         => [
                    'id'         => $team->id,
                    'name'       => $team->team_name,
                    'plan_limit' => 10, // extend from settings later
                ],
                'members'      => $members,
                'total'        => $members->count(),
            ]);
        });
    }

    /**
     * POST /api/v1/team/members/invite
     * Invite a user by email. If user exists they are added immediately; otherwise stored as pending invite.
     */
    public function invite(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $this->authorizeRole(['owner', 'admin']);

            $data = $request->validate([
                'email' => ['required', 'email'],
                'role'  => ['required', Rule::in(['admin', 'editor', 'viewer'])],
            ]);

            // Prevent duplicate membership
            $alreadyMember = TeamMember::where('team_id', $this->teamId)
                ->where(function ($q) use ($data) {
                    $q->whereHas('user', fn($u) => $u->where('email', $data['email']))
                      ->orWhere('invited_email', $data['email']);
                })
                ->exists();

            if ($alreadyMember) {
                throw ValidationException::withMessages([
                    'email' => ['This user is already a member or has a pending invite.'],
                ]);
            }

            $user = User::where('email', $data['email'])->first();

            $member = TeamMember::create([
                'team_id'       => $this->teamId,
                'user_id'       => $user?->id,
                'role'          => $data['role'],
                'status'        => $user ? 'active' : 'invited',
                'invited_email' => $user ? null : $data['email'],
            ]);

            $this->log('invited member', $data['email']);

            return $this->successResponse('Member invited successfully.', $member->load('user:id,name,email,avatar'), 201);
        });
    }

    /**
     * PUT /api/v1/team/members/{member}/role
     * Update a member's role.
     */
    public function updateRole(Request $request, int $member): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $member) {
            $this->authorizeRole(['owner', 'admin']);

            $data = $request->validate([
                'role' => ['required', Rule::in(['admin', 'editor', 'viewer'])],
            ]);

            $teamMember = TeamMember::where('team_id', $this->teamId)->findOrFail($member);

            // Prevent changing owner's role
            $team = Auth::user()->teams->first();
            if ($teamMember->user_id === $team->creator_id) {
                throw ValidationException::withMessages([
                    'role' => ["The team owner's role cannot be changed."],
                ]);
            }

            $teamMember->update(['role' => $data['role']]);

            $this->log('updated role of', $teamMember->user?->email ?? $teamMember->invited_email);

            return $this->successResponse('Role updated successfully.', $teamMember->fresh('user:id,name,email,avatar'));
        });
    }

    /**
     * DELETE /api/v1/team/members/{member}
     * Remove a member from the team.
     */
    public function remove(int $member): JsonResponse
    {
        return $this->respondSafely(function () use ($member) {
            $this->authorizeRole(['owner', 'admin']);

            $teamMember = TeamMember::where('team_id', $this->teamId)->findOrFail($member);

            $team = Auth::user()->teams->first();
            if ($teamMember->user_id === $team->creator_id) {
                throw ValidationException::withMessages([
                    'member' => ['The team owner cannot be removed.'],
                ]);
            }

            // Prevent self-removal
            if ($teamMember->user_id === Auth::id()) {
                throw ValidationException::withMessages([
                    'member' => ['You cannot remove yourself from the team.'],
                ]);
            }

            $name = $teamMember->user?->email ?? $teamMember->invited_email;
            $teamMember->delete();

            $this->log('removed member', $name);

            return $this->successResponse('Member removed successfully.');
        });
    }

    /**
     * GET /api/v1/team/activity
     * Recent activity log for the team (latest 20 entries).
     */
    public function activity(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $logs = TeamActivityLog::where('team_id', $this->teamId)
                ->with('user:id,name,email,avatar')
                ->latest()
                ->paginate((int) ($request->items ?? 20));

            return $this->successResponse('Team activity retrieved.', $logs);
        });
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function authorizeRole(array $allowedRoles): void
    {
        if (!in_array($this->membership->role, $allowedRoles)) {
            abort(403, 'You do not have permission to perform this action.');
        }
    }

    private function log(string $action, ?string $subject = null): void
    {
        TeamActivityLog::create([
            'team_id' => $this->teamId,
            'user_id' => Auth::id(),
            'action'  => $action,
            'subject' => $subject,
        ]);
    }

    private function respondSafely(Closure $callback): JsonResponse
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed.', 422, $e->errors());
        } catch (HttpExceptionInterface $e) {
            return $this->errorResponse($e->getMessage() ?: 'Request failed.', $e->getStatusCode());
        } catch (Throwable $e) {
            report($e);

            return $this->errorResponse('Something went wrong. Please try again later.', 500);
        }
    }
}
