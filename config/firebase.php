<?php

return [
    'service_account_path' => env('FIREBASE_SERVICE_ACCOUNT_PATH', 'storage/app/firebase/service-account.json'),
    'endpoint' => env('FIREBASE_FCM_ENDPOINT', 'https://fcm.googleapis.com/v1/projects/%s/messages:send'),
];
