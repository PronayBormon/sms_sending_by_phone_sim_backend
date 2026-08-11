<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Updated Offer After Inspection</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background:#f4f4f4;padding:30px 15px;">
        <tr>
            <td align="center">

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:#111111;padding:24px;">
                            <h1 style="margin:0;font-size:24px;color:#ffffff;">Updated Offer After Inspection</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:35px 30px;color:#333333;font-size:16px;line-height:1.7;">

                            <p style="margin:0 0 18px;">Hi {{$sell->first_name}},</p>

                            <p style="margin:0 0 18px;">
                                During inspection, we identified a discrepancy between the submitted condition and the
                                received item.
                            </p>

                            <p style="margin:0 0 10px;"><strong>Details:</strong></p>
                            <p>{!!$quote->message!!}</p>

                            <!-- Items Table -->
                            @if(!empty($quote->items) && count($quote->items) > 0)
                            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="border-collapse:collapse;margin-bottom:25px;">

                                <tr style="background:#f8f8f8;">
                                    <th style="padding:12px;border:1px solid #dddddd;text-align:left;font-size:15px;">
                                        Item
                                    </th>
                                    <th style="padding:12px;border:1px solid #dddddd;text-align:right;font-size:15px;">
                                        Price
                                    </th>
                                </tr>

                                @foreach ($quote->items as $item)
                                <tr>
                                    <td style="padding:12px;border:1px solid #dddddd;">
                                        {{$item->item->product->product_title}}
                                    </td>
                                    <td style="padding:12px;border:1px solid #dddddd;text-align:right;">
                                        ${{$item->price}}
                                    </td>
                                </tr>
                                @endforeach

                            </table>
                            @endif

                            <p style="margin:0 0 25px;">
                                <strong>Revised Offer:</strong> ${{$quote->total_price}}
                            </p>

                            <!-- Buttons -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="margin-bottom:25px;">
                                <tr>
                                    <td align="center">

                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding:0 8px 10px;">
                                                    <a href="{{$acceptUrl}}"
                                                        style="background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;display:inline-block;font-weight:bold;">
                                                        Accept Revised Offer
                                                    </a>
                                                </td>

                                                <td style="padding:0 8px 10px;">
                                                    <a href="{{$declineUrl}}"
                                                        style="background:#dc2626;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;display:inline-block;font-weight:bold;">
                                                        Decline & Return Item
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 18px;">
                                If declined, we will coordinate return shipping.
                            </p>

                            <p style="margin:0 0 18px;">
                                Please respond within <strong>48 hours</strong> to avoid processing delays.
                            </p>

                            <p style="margin:0 0 18px;">
                                Thank you for your understanding.
                            </p>

                            <p style="margin:0;">
                                Best regards,<br>
                                <strong>Okazzion Team</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background:#f9f9f9;padding:18px;font-size:13px;color:#888888;">
                            © {{date('Y')}} Okazzion. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>