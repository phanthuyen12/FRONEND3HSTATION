
<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header('Content-Type: application/json'); // Set content type to JSON

    $name = strip_tags(trim($_POST["fname"] ?? ''));
    $lname = strip_tags(trim($_POST["lname"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $subject = trim($_POST["subject"] ?? '');
    $message = trim($_POST["message"] ?? '');

    if (empty($name) || empty($lname) || empty($message) || empty($subject) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["error" => "Please complete the form and ensure all fields are valid."]);
        exit;
    }

    $recipient = "yourmail@gmail.com";
    $email_content = "Name: $name $lname\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Subject: $subject\n\n";
    $email_content .= "Message:\n$message\n";

    $email_headers = "From: $name <$email>";

    if (mail($recipient, "New Contact: $subject", $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["success" => "Thank you! Your message has been sent."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Oops! Something went wrong. Please try again later."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["error" => "Forbidden request."]);
}
?>

