<?php

use App\Models\Setting;

$systemSettings = Setting::first();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding:30px 0;">
        <tr>
            <td align="center">

                <table role="presentation" width="600" cellpadding="0" cellspacing="0"
                    style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:#111111; padding:30px;">
                            <h1 style="margin:0; color:#ffffff; font-size:28px;">
                                {{ $systemSettings->site_name ?? config('app.name') }}
                            </h1>
                        </td>
                    </tr>

                    <!-- Hero -->
                    <tr>
                        <td align="center" style="padding:50px 30px 30px;">
                            <h2 style="margin:0; color:#111111; font-size:32px;">
                                Welcome! 🎉
                            </h2>

                            <p style="margin:15px 0 0; color:#666666; font-size:18px; line-height:1.6;">
                                We're delighted to have you here.
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:10px 40px 50px; color:#333333; font-size:16px; line-height:1.8;">

                            <p>
                                Hi <strong>{{ $name }}</strong>,
                            </p>

                            <p>
                                Thank you for joining us. Your account has been successfully created,
                                and you're all set to get started.
                            </p>

                            <p>
                                We're committed to providing a seamless and enjoyable experience,
                                and we look forward to supporting you every step of the way.
                            </p>

                            <p>
                                Take a moment to explore everything available to you and make the
                                most of your experience.
                            </p>

                            <!-- CTA Button -->
                            {{-- <table role="presentation" align="center" cellpadding="0" cellspacing="0"
                                style="margin:35px auto;">
                                <tr>
                                    <td align="center" bgcolor="#111111" style="border-radius:6px;">
                                        <a href="{{ $actionUrl ?? config('app.url') }}"
                                            style="display:inline-block; padding:14px 32px; color:#ffffff; text-decoration:none; font-size:16px; font-weight:bold;">
                                            Get Started
                                        </a>
                                    </td>
                                </tr>
                            </table> --}}

                            <div
                                style="background:#f8f9fa; padding:20px; border-left:4px solid #111111; margin:30px 0;">
                                If you have any questions or need assistance, we're always here to help.
                            </div>

                            <p>
                                Once again, welcome, and thank you for being part of our community.
                            </p>

                            <p style="margin-bottom:0;">
                                Best regards,<br>
                                <strong>The {{ $systemSettings->site_name ?? config('app.name') }} Team</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background:#f9f9f9; padding:25px; color:#888888; font-size:13px;">
                            © {{ date('Y') }} {{ $systemSettings->site_name ?? config('app.name') }}. All rights
                            reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>