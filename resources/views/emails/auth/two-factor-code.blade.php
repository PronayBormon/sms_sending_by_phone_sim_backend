<x-mail::message>
# Two-Factor Authentication Code

You are attempting to sign in or enable email two-factor authentication. Please use the verification code below:

<x-mail::panel>
# {{ $code }}
</x-mail::panel>

This code will expire in 15 minutes. If you did not request this code, please ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
