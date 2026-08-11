<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
    <title>Sell Request Approved</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial, sans-serif;">

    <table width="100%"
        cellpadding="0"
        cellspacing="0"
        style="padding:20px;">
        <tr>
            <td align="center">

                <table width="600"
                    cellpadding="0"
                    cellspacing="0"
                    style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

                    <!-- HEADER -->
                    <tr>
                        <td style="background:#28a745; color:#fff; padding:20px; text-align:center;">
                            <h2 style="margin:0;">Sell Request Approved</h2>
                        </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                        <td style="padding:30px; color:#333;">

                            <p style="font-size:16px;">
                                Hello <strong>{{ $sellRequest->first_name }} {{ $sellRequest->last_name }}</strong>,
                            </p>

                            <p style="font-size:15px; line-height:1.6;">
                                Great news! Your sell request has been
                                <strong style="color:#28a745;">approved</strong>.
                            </p>

                            <p style="font-size:15px; line-height:1.6;">
                                You can now proceed with the next steps by clicking the button below.
                            </p>

                            <!-- BUTTON -->
                            <div style="text-align:center; margin:30px 0;">
                                <a href="{{ env('APPROVE_LINK') . '/' . $sellRequest->sell_id }}"
                                    style="background:#28a745; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px; font-size:14px;">
                                    View & Continue
                                </a>
                            </div>

                            <p style="font-size:14px; color:#666;">
                                If you did not make this request, please ignore this email.
                            </p>

                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="background:#f8f9fa; padding:15px; text-align:center; font-size:13px; color:#999;">
                            © {{ date('Y') }} {{ env('APP_NAME') }}. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
