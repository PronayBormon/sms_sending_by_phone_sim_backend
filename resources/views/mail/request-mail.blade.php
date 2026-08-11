<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Equipment Received</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
        style="background-color:#f4f4f4; padding:30px 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600"
                    style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:#111111; padding:25px;">
                            <h1 style="margin:0; color:#ffffff; font-size:24px;">Okazzion</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:40px 30px; color:#333333; font-size:16px; line-height:1.6;">

                            <p style="margin-top:0;">Hi <strong>{{$sell->first_name}}</strong>,</p>

                            <p>
                                We’ve received your equipment.
                            </p>

                            <p style="margin:15px 0;">
                                <strong>Request ID:</strong> {{$sell->sell_id}}
                            </p>

                            <p>
                                Our team is now completing intake documentation and inspection.
                                This process typically takes <strong>1–2 business days</strong>.
                                You’ll receive an update once the inspection is complete.
                            </p>

                            <p>
                                Thank you for your patience and for choosing Okazzion.
                            </p>

                            <p style="margin-bottom:0;">
                                Best regards,<br>
                                <strong>Okazzion Team</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background:#f9f9f9; padding:20px; font-size:13px; color:#888888;">
                            © 2026 Okazzion. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>