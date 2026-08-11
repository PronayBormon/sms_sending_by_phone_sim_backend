<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offer Accepted</title>
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

                            <p style="margin-top:0;">Hi <strong>{{$name}}</strong>,</p>

                            <p>
                                Thank you for accepting our offer. We will process your shipping label shortly.
                            </p>

                            <h3 style="margin-bottom:10px; color:#111111;">Next Steps:</h3>

                            <ul style="padding-left:20px; margin-top:0;">
                                <li>Ship your equipment using our free, insured shipping label</li>
                                <li>Once received, we’ll inspect your items and process your payment promptly</li>
                                <li>If there are any discrepancies, we will reach out to you directly</li>
                            </ul>

                            <p>
                                Thank you for choosing Okazzion.
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
                            ©{{ date('Y') }} Okazzion. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>