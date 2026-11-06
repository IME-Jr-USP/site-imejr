<?php
declare(strict_types=1);

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

final class BookingError extends RuntimeException {
    public function __construct(public int $status, string $message, public string $reason = "") { parent::__construct($message); }
}

function booking_json(array $body, int $status = 200): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function booking_inside(string $path, string $root): bool {
    return str_starts_with(rtrim($path, '/') . '/', rtrim($root, '/') . '/');
}

function booking_bootstrap(): array {
    date_default_timezone_set('America/Sao_Paulo');
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    header('X-Robots-Tag: noindex, nofollow');
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
    $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: __DIR__;
    $path = getenv('IMEJR_BOOKING_CONFIG') ?: dirname($root) . '/imejr-private/booking.php';
    $real = realpath($path);
    if (!$real || booking_inside($real, $root)) {
        throw new BookingError(503, 'A agenda ainda não está disponível. Fale com contato@imejr.com.');
    }
    $config = require $real;
    if (!is_array($config) || strlen($config['secret'] ?? '') < 32 || empty($config['admins'])) {
        throw new RuntimeException('Invalid booking configuration');
    }
    $config['storage_dir'] = $config['storage_dir'] ?? dirname($real);
    $storage = realpath($config['storage_dir']);
    if (!$storage || booking_inside($storage, $root) || !is_writable($storage)) {
        throw new RuntimeException('Private storage unavailable');
    }
    $config['storage_dir'] = $storage;
    $development = ($config['environment'] ?? '') === 'development';
    $https = ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['SERVER_PORT'] ?? '') === '443';
    if (!$development && !$https) throw new BookingError(400, 'Acesse a agenda por HTTPS.');
    if ($development && !in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) {
        throw new BookingError(403, 'Ambiente local indisponível.');
    }
    if (!empty($_SERVER['HTTP_ORIGIN']) && !in_array(rtrim($_SERVER['HTTP_ORIGIN'], '/'), $config['origins'] ?? [], true)) {
        throw new BookingError(403, 'Origem da solicitação inválida.');
    }
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name($development ? 'imejr_booking_dev' : '__Host-imejr_booking');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => !$development, 'httponly' => true, 'samesite' => 'Strict']);
    session_start();
    $_SESSION['booking_csrf'] ??= bin2hex(random_bytes(32));
    return $config;
}

function booking_input(): array {
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
        throw new BookingError(415, 'Envie os dados como JSON.');
    }
    $raw = file_get_contents('php://input', false, null, 0, 20001);
    if (!$raw || strlen($raw) > 20000) throw new BookingError(413, 'Solicitação muito extensa.');
    try { $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR); }
    catch (JsonException) { throw new BookingError(400, 'Dados inválidos.'); }
    if (!is_array($data) || !is_string($data['csrf'] ?? null) || !hash_equals($_SESSION['booking_csrf'], $data['csrf'])) {
        throw new BookingError(403, 'Sua sessão expirou. Atualize a página e tente novamente.');
    }
    return $data;
}

// A separate lock file serializes read/modify/write; rename keeps the JSON intact on failure.
function booking_store(array $config, callable $callback): mixed {
    $directory = $config['storage_dir'];
    $lock = fopen($directory . '/booking.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX)) throw new RuntimeException('Storage lock unavailable');
    chmod($directory . '/booking.lock', 0600);
    try {
        $path = $directory . '/booking-data.json';
        $state = is_file($path) ? json_decode((string)file_get_contents($path), true, 64, JSON_THROW_ON_ERROR) : ['slots' => [], 'deliveries' => [], 'rates' => []];
        if (!is_array($state) || !isset($state['slots'], $state['rates'])) throw new RuntimeException('Invalid storage');
        unset($state['requests']); // Remove the old request history; personal details now go only to email.
        $state['deliveries'] ??= [];
        $now = time();
        foreach ($state['rates'] as $key => $rate) if ($rate['expires'] < $now) unset($state['rates'][$key]);
        foreach ($state['deliveries'] as $key => $delivery) if ($delivery['created_at'] < $now - 86400) unset($state['deliveries'][$key]);
        foreach ($state['slots'] as $key => $slot) if ($slot['date'] < date('Y-m-d', $now - 2 * 86400)) unset($state['slots'][$key]);
        $result = $callback($state);
        $json = json_encode($state, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        $temporary = tempnam($directory, '.booking-');
        if ($temporary === false) throw new RuntimeException('Temporary storage unavailable');
        try {
            chmod($temporary, 0600);
            if (file_put_contents($temporary, $json) !== strlen($json) || !rename($temporary, $path)) throw new RuntimeException('Storage write failed');
        } finally { if (is_file($temporary)) unlink($temporary); }
        return $result;
    } finally { flock($lock, LOCK_UN); fclose($lock); }
}

function booking_limit(array $config, string $scope, int $limit, int $seconds, bool $global = false): void {
    $identity = $global ? 'global' : ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $key = hash_hmac('sha256', $scope . ':' . $identity, $config['secret']);
    $allowed = booking_store($config, function (&$state) use ($key, $limit, $seconds) {
        $rate = $state['rates'][$key] ?? ['count' => 0, 'expires' => time() + $seconds];
        if ($rate['expires'] < time()) $rate = ['count' => 0, 'expires' => time() + $seconds];
        if ($rate['count'] >= $limit) return false;
        $rate['count']++;
        $state['rates'][$key] = $rate;
        return true;
    });
    if (!$allowed) throw new BookingError(429, 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
}

function booking_day(string $date, array $config, ?DateTimeImmutable $today = null): bool {
    $today ??= new DateTimeImmutable('today');
    $day = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
    if (!$day || $day->format('Y-m-d') !== $date || $day <= $today || $day > $today->modify('+45 days') || (int)$day->format('N') > 5) return false;
    $fixed = ['01-01','04-21','05-01','09-07','10-12','11-02','11-15','11-20','12-25'];
    return !in_array($day->format('m-d'), $fixed, true) && !in_array($date, $config['blocked_dates'] ?? [], true);
}

function booking_business_dates(array $config): array {
    $dates = [];
    for ($day = new DateTimeImmutable('tomorrow'); $day <= new DateTimeImmutable('+45 days'); $day = $day->modify('+1 day')) {
        if (booking_day($day->format('Y-m-d'), $config)) $dates[] = $day->format('Y-m-d');
    }
    return $dates;
}

function booking_time(string $time): bool { return (bool)preg_match('/^(0[8-9]|1[0-9]):[03]0$/', $time); }
function booking_area(string $area): bool { return in_array($area, ['computacao', 'dados', 'geral'], true); }
function booking_text(mixed $text, int $min, int $max): string {
    if (!is_string($text)) throw new BookingError(422, 'Preencha todos os campos corretamente.');
    $text = trim($text);
    if (mb_strlen($text) < $min || mb_strlen($text) > $max) throw new BookingError(422, 'Confira o tamanho dos campos preenchidos.');
    return $text;
}

function booking_validate(array $data): array {
    $name = booking_text($data['name'] ?? '', 2, 120);
    $email = booking_text($data['email'] ?? '', 5, 254);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) throw new BookingError(422, 'Informe um e-mail válido.');
    $area = booking_text($data['area'] ?? '', 3, 20);
    if (!booking_area($area)) throw new BookingError(422, 'Selecione uma área.');
    if (($data['consent'] ?? false) !== true) throw new BookingError(422, 'Precisamos da sua autorização para responder à solicitação.');
    $slots = $data['slots'] ?? [];
    if (!is_array($slots) || count($slots) < 1 || count($slots) > 3 || count(array_unique($slots, SORT_REGULAR)) !== count($slots)) throw new BookingError(422, 'Escolha de um a três horários diferentes.');
    foreach ($slots as $id) if (!is_string($id) || !preg_match('/^[a-f0-9]{32}$/', $id)) throw new BookingError(422, 'Horário inválido.');
    $key = booking_text($data['key'] ?? '', 32, 64);
    if (!preg_match('/^[a-f0-9-]{32,64}$/', $key)) throw new BookingError(422, 'Identificador inválido. Atualize a página.');
    $rawLinks = booking_text($data['links'] ?? '', 0, 6000);
    $links = $rawLinks === '' ? [] : preg_split('/\R/', $rawLinks);
    if (count($links) > 5) throw new BookingError(422, 'Informe no máximo cinco links, um por linha.');
    foreach ($links as $link) {
        if (strlen($link) > 2000 || !filter_var($link, FILTER_VALIDATE_URL) || !in_array(strtolower(parse_url($link, PHP_URL_SCHEME) ?: ''), ['https', 'http'], true)) throw new BookingError(422, 'Use links http ou https, um por linha.');
    }
    return ['name' => $name, 'email' => $email, 'organization' => booking_text($data['organization'] ?? '', 0, 160), 'description' => booking_text($data['description'] ?? '', 30, 5000), 'area' => $area, 'links' => $links, 'slot_ids' => $slots, 'key' => $key];
}

// Only a delivery fingerprint is persisted. Names, emails and project details stay in memory.
function booking_prepare(array &$state, array $input, array $config): array {
    $key = hash_hmac('sha256', $input['key'], $config['secret']);
    $digest = hash_hmac('sha256', json_encode($input, JSON_THROW_ON_ERROR), $config['secret']);
    $existing = $state['deliveries'][$key] ?? null;
    if ($existing) {
        if (!hash_equals($existing['digest'], $digest) && $existing['status'] !== 'failed') throw new BookingError(409, 'Esta tentativa já foi usada com outros dados. Atualize a página.');
        if ($existing['status'] === 'sent') return ['id' => $existing['id'], 'send' => false, 'key' => $key];
        if ($existing['status'] === 'sending' && $existing['updated_at'] > time() - 120) throw new BookingError(409, 'O envio está em andamento. Aguarde alguns instantes antes de tentar novamente.');
    }
    $selected = [];
    foreach ($input['slot_ids'] as $id) {
        $slot = $state['slots'][$id] ?? null;
        if (!$slot || !$slot['open'] || !booking_day($slot['date'], $config) || ($slot['area'] !== 'geral' && $slot['area'] !== $input['area'])) throw new BookingError(409, 'Um dos horários não está mais disponível. Volte ao calendário e escolha novamente.', 'availability_changed');
        foreach ($selected as $other) {
            if ($other['date'] === $slot['date'] && $other['time'] === $slot['time']) throw new BookingError(422, 'Escolha horários diferentes.');
        }
        $selected[] = $slot;
    }
    $id = $existing['id'] ?? bin2hex(random_bytes(16));
    $state['deliveries'][$key] = ['id' => $id, 'digest' => $digest, 'status' => 'sending', 'created_at' => $existing['created_at'] ?? time(), 'updated_at' => time()];
    $request = $input;
    unset($request['slot_ids'], $request['key']);
    $request['id'] = $id;
    $request['slots'] = $selected;
    return ['id' => $id, 'key' => $key, 'send' => true, 'request' => $request];
}

function booking_finish(array $config, string $key, bool $sent): void {
    booking_store($config, function (&$state) use ($key, $sent) {
        if (isset($state['deliveries'][$key])) {
            $state['deliveries'][$key]['status'] = $sent ? 'sent' : 'failed';
            $state['deliveries'][$key]['updated_at'] = time();
        }
    });
}

function booking_escape(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function booking_email(array $request): string {
    $e = 'booking_escape';
    $area = ['computacao' => 'Computação', 'dados' => 'Dados', 'geral' => 'A definir'][$request['area']];
    $slots = '';
    foreach ($request['slots'] as $index => $slot) {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $slot['date'])->format('d/m/Y');
        $slots .= '<tr><td style="padding:14px 0;border-bottom:1px solid #ddd">Opção ' . ($index + 1) . '</td><td style="padding:14px 0;border-bottom:1px solid #ddd;font-weight:bold">' . $date . ' · ' . $e($slot['time']) . '–' . $e($slot['end']) . '</td></tr>';
    }
    $links = '';
    foreach ($request['links'] as $link) $links .= '<li style="margin-bottom:8px"><a href="' . $e($link) . '">' . $e($link) . '</a></li>';
    return '<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f0f0f0;font-family:Arial,sans-serif;color:#151515"><table role="presentation" style="width:100%;padding:24px"><tr><td><table role="presentation" style="max-width:640px;width:100%;margin:auto;background:#fff;border-collapse:collapse"><tr><td style="background:#101010;color:#FFDA33;padding:28px;font-size:22px;font-weight:bold">IME Jr / Solicitação de reunião</td></tr><tr><td style="padding:28px"><p style="color:#666;font-size:12px">ÁREA: ' . $area . ' · SOLICITAÇÃO ' . $e(substr($request['id'], 0, 8)) . '</p><h1 style="font-size:24px;margin:20px 0">Novo projeto para conversar</h1><p><strong>' . $e($request['name']) . '</strong><br>' . $e($request['organization']) . '<br><a href="mailto:' . $e($request['email']) . '">' . $e($request['email']) . '</a></p><h2 style="font-size:18px;margin-top:28px">Horários sugeridos</h2><p style="font-size:13px;color:#666">Horário de Brasília · opções sujeitas à confirmação.</p><table style="width:100%;border-collapse:collapse">' . $slots . '</table><h2 style="font-size:18px;margin-top:28px">Sobre o projeto</h2><p style="line-height:1.7;white-space:pre-wrap">' . nl2br($e($request['description'])) . '</p>' . ($links ? '<h2 style="font-size:18px">Documentos e referências</h2><ul>' . $links . '</ul><p style="font-size:12px;color:#666">Links fornecidos pelo solicitante. Verifique a origem antes de abrir.</p>' : '') . '<p style="margin-top:30px;padding:18px;background:#FFF7CF;line-height:1.6">Responda ao solicitante para confirmar uma das opções e enviar o convite da reunião. Esta mensagem não reserva automaticamente os horários.</p><p style="font-size:12px;color:#777">Esta solicitação é enviada apenas por e-mail; não há histórico de pedidos no painel.</p></td></tr></table></td></tr></table></body></html>';
}

function booking_send(array $config, array $request): bool {
    booking_limit($config, 'mail-minute', 5, 60, true);
    booking_limit($config, 'mail-day', 70, 86400, true);
    $html = booking_email($request);
    if (($config['environment'] ?? '') === 'development') {
        $path = $config['storage_dir'] . '/email-' . $request['id'] . '.html';
        $sent = file_put_contents($path, $html) !== false;
        if ($sent) chmod($path, 0600);
        return $sent;
    }
    $headers = ['MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', 'From: IME Jr <contato@imejr.com>', 'Reply-To: ' . $request['email']];
    return mail('contato@imejr.com', '=?UTF-8?B?' . base64_encode('IME Jr — Solicitação de reunião') . '?=', $html, implode("\r\n", $headers));
}

function booking_authenticated(array $config): bool {
    $auth = $_SESSION['booking_admin'] ?? null;
    if (!$auth) return false;
    $hash = $config['admins'][$auth['user']] ?? '';
    if (!$hash || !hash_equals($auth['version'], hash('sha256', $hash)) || $auth['seen'] < time() - 1200 || $auth['created'] < time() - 28800) {
        unset($_SESSION['booking_admin']);
        return false;
    }
    $_SESSION['booking_admin']['seen'] = time();
    return true;
}

function booking_admin_slots(array &$state, array $data, array $config): int {
    $from = booking_text($data['from'] ?? '', 10, 10);
    $until = booking_text($data['until'] ?? '', 10, 10);
    $start = booking_text($data['start'] ?? '', 5, 5);
    $end = booking_text($data['end'] ?? '', 5, 5);
    $area = booking_text($data['area'] ?? 'geral', 3, 20);
    if (!booking_day($from, $config)) throw new BookingError(422, 'A data inicial deve ser um dia útil futuro, nos próximos 45 dias. Hoje, fins de semana e feriados bloqueados não são aceitos.');
    if ($until < $from) throw new BookingError(422, 'A data final não pode ser anterior à data inicial.');
    if (!booking_day($until, $config)) throw new BookingError(422, 'A data final deve ser um dia útil futuro, nos próximos 45 dias.');
    if (!booking_time($start) || !booking_time($end)) throw new BookingError(422, 'Use horários entre 08:00 e 19:30, em intervalos de 30 minutos, como 09:00 ou 09:30.');
    if ($start >= $end) throw new BookingError(422, 'O horário final deve ser posterior ao horário inicial.');
    if (!booking_area($area)) throw new BookingError(422, 'Selecione uma área válida.');
    $count = 0;
    for ($day = new DateTimeImmutable($from); $day->format('Y-m-d') <= $until; $day = $day->modify('+1 day')) {
        $date = $day->format('Y-m-d');
        if (!booking_day($date, $config)) continue;
        for ($time = new DateTimeImmutable($date . ' ' . $start); $time->format('H:i') < $end; $time = $time->modify('+30 minutes')) {
            $id = substr(hash('sha256', $date . ':' . $time->format('H:i') . ':' . $area), 0, 32);
            // A closed slot is never reopened by publishing a range; do so explicitly.
            if (isset($state['slots'][$id])) continue;
            $state['slots'][$id] = ['id' => $id, 'date' => $date, 'time' => $time->format('H:i'), 'end' => $time->modify('+30 minutes')->format('H:i'), 'area' => $area, 'open' => true];
            $count++;
        }
    }
    return $count;
}
