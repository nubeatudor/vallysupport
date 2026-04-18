<?php
// /public_html/send_email.php — single-file mailer, no Composer

// Return headers
header('Content-Type: text/plain; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Method not allowed');
}

// Helper: sanitize incoming fields
function f($key) {
  $v = isset($_POST[$key]) ? trim($_POST[$key]) : '';
  return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$name    = f('name');
$company = f('company');
$fleet   = f('fleet');
$phone   = f('phone');
$email   = f('email');
$pain    = f('pain');        // if you have a select for Main Pain Point
$msg     = f('message');
$consent = isset($_POST['consent']) ? 'Yes' : 'No';

// Basic validation (adjust if your form has different required fields)
if ($name === '' || $company === '' || $fleet === '' || $phone === '' || $email === '' || $pain === '') {
  http_response_code(422);
  exit('Missing required fields.');
}

// --- CONFIGURE THESE TWO LINES ---
$to       = 'info@vallysupport.com';          // where you want to receive leads
$fromAddr = 'info@vallysupport.com';       // must be an address on your domain
// ---------------------------------

// Build subject (allow hidden "subject" field override if you added one)
$subject = f('subject');
if ($subject === '') {
  $subject = "New Quote Request — Website";
}

// Build the plain-text body
$body = "New Request a Quote submission:\n\n".
        "Name:    {$name}\n".
        "Email:   {$email}\n".
        "Phone:   {$phone}\n".
        "Company: {$company}\n".
        "Fleet:   {$fleet}\n".
        "Main Pain Point: {$pain}\n".
        "Consent: {$consent}\n\n".
        "Message:\n{$msg}\n";

// Good practice on shared hosting
@ini_set('sendmail_from', $fromAddr);

// Headers
$headers  = "From: Vally’s Support <{$fromAddr}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Use -f to set envelope sender (improves deliverability)
$envelope = "-f {$fromAddr}";

// Send
$ok = @mail($to, $subject, $body, $headers, $envelope);

if ($ok) {
  // SUCCESS: Redirect to the Thank You page instead of printing 'OK'
  header("Location: thanks.html");
  exit();
} else {
  http_response_code(500);
  exit('Mailer error');
}