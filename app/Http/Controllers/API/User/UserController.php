<?php

namespace App\Http\Controllers\API\User;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePassword;
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
}
