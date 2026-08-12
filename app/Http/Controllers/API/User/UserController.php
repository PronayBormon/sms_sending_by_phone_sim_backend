<?php

namespace App\Http\Controllers\API\User;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePassword;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use ApiResponse;

    private array $notificationFields = [
        'email_notifications',
        'push_notifications',
        'sms_notifications',
        'match_notifications',
        'message_notifications',
        'like_notifications',
        'marketing_notifications',
    ];

    public function profile()
    {
        $auth = Auth::user();
        $user = User::where('id', $auth->id)->with('teams')->first();
        return $this->successResponse('Profile details', $user);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'user_name' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return $this->errorResponse($validator->errors()->first(), 422, $validator->errors());
        }

        $data = $validator->validated();

        if ($request->hasFile('avatar')) {
            $oldAvatar = $user->getRawOriginal('avatar');

            if ($oldAvatar && Storage::exists(str_replace('storage/', 'public/', $oldAvatar))) {
                Storage::delete(str_replace('storage/', 'public/', $oldAvatar));
            }
            $path = $request->file('avatar')->storeAs('uploads/avatar', time() . '.' . $request->file('avatar')->getClientOriginalExtension(), 'public');
            $data['avatar'] = 'storage/' . $path;
        } else {
            unset($data['avatar']);
        }

        if ($user->email !== $data['email']) {
            $data['email_verified_at'] = null;
        }

        $user->update($data);

        return $this->successResponse(
            'Profile updated successfully',
            $user->fresh()
        );
    }

    public function updatePassword(UpdatePassword $request)
    {
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('Current password is incorrect', 422, ['current_password' => ['Current password is incorrect']]);
        }
        $user->update(['password' => $request->password]);
        return $this->successResponse('Password updated successfully');
    }

    public function updateNotifications(Request $request)
    {
        $rules = collect($this->notificationFields)->mapWithKeys(fn($field) => [$field => ['sometimes', 'required', 'boolean']])->toArray();
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', 422, $validator->errors());
        }

        $data = $validator->validated();

        if (empty($data)) {
            return $this->errorResponse(
                'Please provide at least one notification setting',
                422
            );
        }

        $user = $request->user();
        $user->update($data);

        return $this->successResponse(
            'Notification settings updated successfully',
            $user->fresh()->only($this->notificationFields)
        );
    }
    public function createTeam(Request $request)
    {
        $auth = Auth::user();

        // First check active membership by user_id
        $teamMembership = TeamMember::with('team')
            ->where('user_id', $auth->id)
            ->where('status', 'active')
            ->first();

        // If user_id doesn't exist yet, check invitation by email
        if (!$teamMembership) {
            $teamMembership = TeamMember::with('team')
                ->whereNull('user_id')
                ->where('invited_email', $auth->email)
                ->where('status', 'invited')
                ->first();

            // Attach invitation to the logged-in user
            if ($teamMembership) {
                $teamMembership->update([
                    'user_id' => $auth->id,
                    'status' => 'active',
                    'invited_email' => null,
                ]);

                $teamMembership->refresh();
                $teamMembership->load('team');
            }
        }

        // User already belongs to a team
        if ($teamMembership) {
            return response()->json([
                'message' => 'You already have a team.',
                'team' => $teamMembership->team,
            ], 409);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        // Create new team
        $team = Team::create([
            'creator_id' => $auth->id,
            'team_name' => $request->name,
        ]);

        // Creator becomes owner/member
        $membership = TeamMember::create([
            'user_id' => $auth->id,
            'team_id' => $team->id,
            'role' => 'owner',
            'status' => 'active',
        ]);

        return $this->successResponse(
            'Team created successfully.',
            [
                'team' => $team,
                'membership' => $membership,
            ]
        );
    }
}
