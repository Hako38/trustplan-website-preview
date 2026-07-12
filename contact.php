<?php
declare(strict_types=1);

const RECIPIENT = 'info@trust-plan.de';
const SUBJECT = 'Neue Erstgespräch-Anfrage über trust-plan.de';

function fail_request(string $message, int $status = 400): never
{
    http_response_code($status);
    $safeMessage = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    echo '<!doctype html><html lang="de"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<meta name="robots" content="noindex, follow">';
    echo '<title>Anfrage konnte nicht gesendet werden | TrustPlan</title>';
    echo '<link rel="stylesheet" href="./assets/css/style.css?v=20260709-4"></head><body>';
    echo '<main class="tool-page-main" id="main"><section class="tool-page-hero">';
    echo '<div class="container"><p class="eyebrow">Kontaktformular</p>';
    echo '<h1>Anfrage konnte nicht gesendet werden</h1>';
    echo '<p>' . $safeMessage . '</p>';
    echo '<p><a class="btn btn-primary" href="./kontakt.html">Zurück zum Formular</a></p>';
    echo '</div></section></main></body></html>';
    exit;
}

function clean_text(mixed $value, int $maxLength = 200): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = trim(strip_tags($value));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maxLength, 'UTF-8')
        : substr($value, 0, $maxLength);
}

function has_header_injection(string $value): bool
{
    return preg_match('/[\r\n]/', $value) === 1;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail_request('Bitte sende deine Anfrage über das Kontaktformular.', 405);
}

if (clean_text($_POST['website'] ?? '') !== '') {
    header('Location: ./danke.html', true, 303);
    exit;
}

$situation = clean_text($_POST['situation'] ?? '', 60);
$income = clean_text($_POST['income'] ?? '', 30);
$goal = clean_text($_POST['goal'] ?? '', 90);
$name = clean_text($_POST['name'] ?? '', 100);
$phone = clean_text($_POST['phone'] ?? '', 50);
$email = clean_text($_POST['email'] ?? '', 160);
$message = clean_text($_POST['message'] ?? '', 1200);
$privacy = clean_text($_POST['privacy'] ?? '', 20);
$interests = $_POST['interest'] ?? [];

$allowedSituations = ['Gutverdienender Angestellter', 'Selbstständig', 'Unternehmer'];
$allowedIncomes = ['Unter 2500', '2500-4000', '4000-6000', '6000+'];
$allowedInterests = ['Steuern', 'Versicherungen', 'Altersvorsorge', 'Investments', 'Immobilien', 'PKV'];
$allowedGoals = [
    'Steuerlast prüfen',
    'Vermögen strukturierter aufbauen',
    'Absicherung überprüfen',
    'Immobilien als nächsten Schritt prüfen',
    'Finanzielle Gesamtstruktur verstehen',
];

if (!in_array($situation, $allowedSituations, true)
    || !in_array($income, $allowedIncomes, true)
    || !in_array($goal, $allowedGoals, true)) {
    fail_request('Bitte fülle alle Schritte des Formulars vollständig aus.');
}

if ($privacy !== 'accepted') {
    fail_request('Bitte bestätige die Datenschutzhinweise.');
}

if (!is_array($interests)) {
    fail_request('Bitte wähle mindestens ein Interessengebiet aus.');
}

$interests = array_values(array_unique(array_filter(
    array_map(static fn($value): string => clean_text($value, 40), $interests),
    static fn(string $value): bool => in_array($value, $allowedInterests, true)
)));

if ($interests === []) {
    fail_request('Bitte wähle mindestens ein Interessengebiet aus.');
}

$nameLength = function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name);
if ($name === '' || $nameLength < 2 || has_header_injection($name)) {
    fail_request('Bitte gib einen gültigen Namen ein.');
}

if ($phone === '' || !preg_match('/^[0-9+()\/\s.-]{6,30}$/', $phone)) {
    fail_request('Bitte gib eine gültige Telefonnummer ein.');
}

if ($email === '' || has_header_injection($email) || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    fail_request('Bitte gib eine gültige E-Mail-Adresse ein.');
}

$body = implode("\n", [
    'Neue Erstgespräch-Anfrage über trust-plan.de',
    '',
    'Situation: ' . $situation,
    'Nettoeinkommen: ' . $income,
    'Ausgewählte Themen: ' . implode(', ', $interests),
    'Größtes Ziel: ' . $goal,
    '',
    'Name: ' . $name,
    'Telefon: ' . $phone,
    'E-Mail: ' . $email,
    'Nachricht: ' . ($message !== '' ? $message : 'Keine Nachricht angegeben'),
    '',
    'Übermittelt am: ' . date('d.m.Y H:i:s'),
]);

$headers = [
    'From: TrustPlan Website <info@trust-plan.de>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$encodedSubject = function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader(SUBJECT, 'UTF-8')
    : SUBJECT;

$sent = mail(RECIPIENT, $encodedSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    fail_request(
        'Der Versand war leider nicht möglich. Bitte versuche es später erneut oder schreibe direkt an info@trust-plan.de.',
        500
    );
}

header('Location: ./danke.html', true, 303);
exit;
