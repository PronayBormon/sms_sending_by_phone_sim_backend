<!DOCTYPE html>
<html>
<head>
    <title>Team Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; border: 1px solid #eee; padding: 30px;">
        <h2>You have been invited!</h2>
        <p><strong>{{ $inviter->first_name }} {{ $inviter->last_name }}</strong> has invited you to join their team.</p>
        
        <p>By joining this team, you'll be able to collaborate on campaigns, manage contacts, and view SMS analytics together.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $inviteUrl }}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Accept Invitation</a>
        </div>
        
        <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 14px; color: #666; word-break: break-all;">{{ $inviteUrl }}</p>
    </div>
</body>
</html>
