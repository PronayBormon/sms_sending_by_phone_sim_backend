<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Issued</title>
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
                                Our team has completed the inspection of your equipment, and your payment has been
                                issued.
                            </p>

                            <p>
                                Depending on your selected payment method, it may take some time for the funds to
                                appear.
                                If you have any questions, feel free to reply to this email.
                            </p>

                            <!-- Payment Details -->
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                style="margin:25px 0; background:#f9f9f9; border-radius:6px;">
                                <tr>
                                    <td style="padding:20px;">
                                        <p style="margin:0 0 10px 0;">
                                            <strong>Payment Amount:</strong> ${{$quote->total_price}}
                                        </p>
                                        <p style="margin:0;">
                                            <strong>Payment Method:</strong> {{$sell->payment_method}}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p>
                                We look forward to working with you again.
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