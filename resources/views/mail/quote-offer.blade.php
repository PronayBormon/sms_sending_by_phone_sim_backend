<?php

use App\Models\SystemSetting;
use Carbon\Carbon;

$system = SystemSetting::first();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Quote offer Email</title>
</head>

<body style="margin:0;padding:0;background:#e5e7eb;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:25px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:720px;background:#ffffff;border:1px solid #d1d5db;">

                    <!-- Header -->
                    <tr>
                        <td style="padding:20px;">

                            <table width="100%">
                                <tr>
                                    <td>
                                        <h2 style='margin:0;'>{{config('app.name') }}</h2>
                                        <p style='margin:5px 0;font-size:13px;'>Buy Smart . Buy Used</p>
                                    </td>

                                    <td style='text-align:right;'>
                                        <h3 style='margin:0;'>QUOTE</h3>
                                        <p style='margin:5px 0;font-size:12px;'>
                                            Date: {{ Carbon::parse($quote->created_at)->format('Y-m-d')}}<br>
                                            Quote ID: {{$quote->id}} <br>
                                            Sell ID: {{$sellRequest->sell_id}}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Customer -->
                    <tr>
                        <td style="padding:30px 20px 10px;">
                            <p style="margin:0;font-size:16px;color:#000000;">
                                <strong>Customer:</strong><br>
                                {{$sellRequest->first_name}} {{$sellRequest->last_name}}<br>
                                {{$sellRequest->email}}<br>
                                {{$sellRequest->phone}}
                            </p>
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td style="padding:30px 20px 10px;">
                            <p style="margin-top:0;">Hi {{$sellRequest->first_name}},</p>
                            <p style="margin:0;font-size:16px;color:#000000;line-height:1.7;">
                                We've completed our review of your submitted equipment. This offer is based on the
                                details you provided, along with current market conditions.
                                Please take a moment to review the information below. If you have any questions, feel
                                free to reply directly to this email.
                                We’re happy to help.
                            </p>
                        </td>
                    </tr>

                    <!-- Items -->
                    @if(!empty($quote->items) && count($quote->items) > 0)
                    <tr>
                        <td style="padding:20px;">

                            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="border-collapse:collapse;">

                                <tr>
                                    <th style="padding:12px;border:1px solid #000;text-align:left;font-size:15px;">Item
                                    </th>
                                    <th style="padding:12px;border:1px solid #000;text-align:right;font-size:15px;">
                                        Price</th>
                                </tr>

                                @foreach ($quote->items as $item)
                                <tr>
                                    <td style="padding:12px;border:1px solid #000;">
                                        {{$item->item->product->product_title}}
                                    </td>
                                    <td style="padding:12px;border:1px solid #000;text-align:right;">{{$item->price}}
                                        USD</td>
                                </tr>

                                @endforeach

                            </table>

                        </td>
                    </tr>

                    @endif

                    <!-- Total -->
                    <tr>
                        <td style="padding:0 20px 20px;">

                            <table align="right" width="230" cellpadding="0" cellspacing="0" border="0"
                                style="border-collapse:collapse;">
                                <tr>
                                    <td style="padding:14px;border:1px solid #000;font-size:16px;">
                                        <strong>Total</strong>
                                    </td>

                                    <td style="padding:14px;border:1px solid #000;font-size:16px;text-align:right;">
                                        <strong>{{$quote->total_price}} USD</strong>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Buttons -->
                    <tr>
                        <td align="center" style="padding:20px 20px 35px;">

                            <a href="{{$action['accept']}}"
                                style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:18px;font-weight:bold;margin-right:10px;">
                                Accept
                            </a>

                            <a href="{{$action['reject']}}"
                                style="display:inline-block;background:#ef2222;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:18px;font-weight:bold;">
                                Reject
                            </a>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="border-top:1px solid #000;padding:18px;text-align:center;font-size:14px;color:#000000;">
                            Thank you for your business.<br>
                            {{$system->email}}
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>