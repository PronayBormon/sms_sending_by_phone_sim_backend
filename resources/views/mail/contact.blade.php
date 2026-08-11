<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
</head>

<body>
    <div style="font-family: Arial; padding:20px;">
        <h2 style="color:#333;">New Contact Message</h2>

        <p><strong>Name:</strong> {{ $contact->name }}</p>
        <p><strong>Email:</strong> {{ $contact->email }}</p>
        <p><strong>Subject:</strong> {{ $contact->subject ?? 'N/A' }}</p>

        <div style="margin-top:20px; padding:15px; background:#f5f5f5; border-radius:8px;">
            {{ $contact->message }}
        </div>
    </div>
</body>

</html>
