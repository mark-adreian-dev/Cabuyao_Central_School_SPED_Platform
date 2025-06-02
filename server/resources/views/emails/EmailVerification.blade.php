<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Email Verification Code</title>
    <style>
        body {
            background-color: #ffffff;
            color: #cc0000;
            font-family: 'Arial', sans-serif;
            padding: 40px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: #fff;
            border: 2px solid #cc0000;
            border-radius: 10px;
            text-align: center;
            padding: 40px 30px;
            box-shadow: 0 0 10px rgba(204, 0, 0, 0.1);
        }
        h1 {
            color: #cc0000;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .code {
            display: inline-block;
            margin-top: 20px;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #cc0000;
            border: 2px dashed #cc0000;
            border-radius: 6px;
            padding: 15px 20px;
            background-color: #fff0f0;
        }
        p {
            margin-top: 30px;
            font-size: 14px;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Verification</h1>
        <p>Please use the verification code below to confirm your email address:</p>
        <div class="code">{{ $verificationCode }}</div>
        <p>If you did not request this code, please ignore this email.</p>
    </div>
</body>
</html>
