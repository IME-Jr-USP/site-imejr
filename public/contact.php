<?php
declare(strict_types=1);

date_default_timezone_set('America/Sao_Paulo');

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
  exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody ?: '', true);

if (!is_array($data)) {
  $data = $_POST;
}

function field(string $key): string {
  global $data;
  return trim((string)($data[$key] ?? ''));
}

function clean_header(string $value): string {
  return str_replace(["\r", "\n"], '', $value);
}

$name = field('name');
$email = field('email');
$area = field('area');
$message = field('message');
$company = field('company');

if ($company !== '') {
  echo json_encode(['ok' => true]);
  exit;
}

$areaLabels = [
  'computacao' => 'Computação',
  'dados' => 'Dados',
  'outro' => 'Outro',
];

if (
  strlen($name) < 2 ||
  !filter_var($email, FILTER_VALIDATE_EMAIL) ||
  !isset($areaLabels[$area]) ||
  strlen($message) < 10
) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'message' => 'Dados inválidos']);
  exit;
}

$to = 'contato@imejr.com';
$subject = 'Novo contato pelo site da IME Jr';
$areaLabel = $areaLabels[$area];

$body = implode("\n", [
  'Novo contato pelo site da IME Jr',
  '',
  'Nome: ' . $name,
  'E-mail: ' . $email,
  'Área de interesse: ' . $areaLabel,
  '',
  'Mensagem:',
  $message,
  '',
  'Enviado em: ' . date('d/m/Y H:i:s'),
]);

$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: IME Jr <contato@imejr.com>',
  'Reply-To: ' . clean_header($name) . ' <' . clean_header($email) . '>',
  'X-Mailer: PHP/' . phpversion(),
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Erro ao enviar e-mail']);
  exit;
}

echo json_encode(['ok' => true]);
