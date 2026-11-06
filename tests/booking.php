<?php
declare(strict_types=1);
require __DIR__ . '/../public/api/_booking.php';
date_default_timezone_set('America/Sao_Paulo');
function check(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
function rejects(callable $callback, int $code): void {
    try { $callback(); } catch (BookingError $error) { check($error->status === $code, 'Unexpected error: ' . $error->getMessage()); return; }
    throw new RuntimeException('Expected rejection ' . $code);
}
$private = sys_get_temp_dir() . '/imejr-booking-test-' . bin2hex(random_bytes(8));
mkdir($private, 0700);
$config = ['storage_dir' => $private, 'secret' => bin2hex(random_bytes(32)), 'environment' => 'development', 'blocked_dates' => [], 'admins' => ['tester' => password_hash('Test-only-strong-passphrase', PASSWORD_DEFAULT)]];
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
try {
    check(!booking_day('2026-11-20', $config, new DateTimeImmutable('2026-11-02')), 'National holiday accepted');
    check(!booking_day('2026-11-07', $config, new DateTimeImmutable('2026-11-02')), 'Saturday accepted');
    check(!booking_day('2026-02-30', $config), 'Invalid date accepted');
    check(!booking_day(date('Y-m-d'), $config), 'Today accepted');
    $day = new DateTimeImmutable('tomorrow');
    while (!booking_day($day->format('Y-m-d'), $config)) $day = $day->modify('+1 day');
    $date = $day->format('Y-m-d');
    $blocked = $config; $blocked['blocked_dates'] = [$date];
    check(!booking_day($date, $blocked), 'Blocked date accepted');
    $range = ['from' => $date, 'until' => $date, 'start' => '09:00', 'end' => '11:00', 'area' => 'geral'];
    $count = booking_store($config, fn (&$state) => booking_admin_slots($state, $range, $config));
    check($count === 4, 'Expected four half-hour slots');
    check(booking_store($config, fn (&$state) => booking_admin_slots($state, $range, $config)) === 0, 'Duplicate slots inserted');
    $slots = booking_store($config, fn (&$state) => array_values($state['slots']));
    $data = ['name' => '<img src=x onerror=alert(1)>', 'email' => 'test@example.org', 'organization' => 'Test company', 'description' => '<script>alert(1)</script> Descrição longa de um projeto para testar o formulário.', 'area' => 'computacao', 'consent' => true, 'links' => 'https://example.org/document', 'slots' => [$slots[0]['id'], $slots[1]['id']], 'key' => str_repeat('a', 32)];
    rejects(fn () => booking_validate(array_replace($data, ['slots' => []])), 422);
    rejects(fn () => booking_validate(array_replace($data, ['slots' => [$slots[0]['id'], $slots[0]['id']]])), 422);
    rejects(fn () => booking_validate(array_replace($data, ['email' => "test@example.org\r\nBcc:evil@example.org"])), 422);
    rejects(fn () => booking_validate(array_replace($data, ['links' => 'javascript:alert(1)'])), 422);
    rejects(fn () => booking_validate(array_replace($data, ['consent' => false])), 422);
    rejects(fn () => booking_validate(array_replace($data, ['area' => ['unexpected']])), 422);
    rejects(fn () => booking_validate(array_replace($data, ['description' => 'short'])), 422);
    $input = booking_validate($data);
    $result = booking_store($config, fn (&$state) => booking_prepare($state, $input, $config));
    $id = $result['id'];
    check($result['send'], 'First delivery not prepared');
    rejects(fn () => booking_store($config, fn (&$state) => booking_prepare($state, $input, $config)), 409);
    $html = booking_email($result['request']);
    check(!str_contains($html, '<script>') && !str_contains($html, '<img src=x'), 'Email HTML injection');
    check(str_contains($html, '&lt;script&gt;') && str_contains($html, 'Opção 2'), 'Email incomplete');
    // A failed send can be retried, including corrections to the form.
    booking_finish($config, $result['key'], false);
    $corrected = array_replace($input, ['organization' => 'Corrected organization']);
    $retry = booking_store($config, fn (&$state) => booking_prepare($state, $corrected, $config));
    check($retry['send'], 'Failed email cannot be retried');
    check(booking_send($config, $retry['request']), 'Development email not captured');
    booking_finish($config, $retry['key'], true);
    $duplicate = booking_store($config, fn (&$state) => booking_prepare($state, $corrected, $config));
    check(!$duplicate['send'] && $duplicate['id'] === $id, 'Duplicate email not prevented');
    rejects(fn () => booking_store($config, fn (&$state) => booking_prepare($state, array_replace($corrected, ['email' => 'different@example.org']), $config)), 409);
    check(is_file($private . '/email-' . $id . '.html'), 'Email preview missing');
    $stored = file_get_contents($private . '/booking-data.json');
    foreach (['test@example.org', 'Corrected organization', '<script>', 'description', 'slot_ids'] as $personal) check(!str_contains($stored, $personal), 'Personal data persisted: ' . $personal);
    check(!array_key_exists('requests', json_decode($stored, true)), 'Request history persisted');
    booking_store($config, function (&$state) { $state['requests'] = ['legacy' => ['name' => 'Legacy personal record']]; });
    $migrated = booking_store($config, fn (&$state) => $state);
    check(!isset($migrated['requests']) && count($migrated['slots']) === count($slots), 'Legacy history not removed safely');
    booking_store($config, function (&$state) use ($slots) { $state['slots'][$slots[0]['id']]['open'] = false; });
    check(booking_store($config, fn (&$state) => booking_admin_slots($state, $range, $config)) === 0, 'Closed slot recreated');
    $new = array_replace($input, ['key' => str_repeat('b', 32)]);
    rejects(fn () => booking_store($config, fn (&$state) => booking_prepare($state, $new, $config)), 409);
    for ($index = 0; $index < 3; $index++) booking_limit($config, 'unit-test', 3, 300);
    rejects(fn () => booking_limit($config, 'unit-test', 3, 300), 429);
    $_SESSION['booking_admin'] = ['user' => 'tester', 'version' => hash('sha256', $config['admins']['tester']), 'created' => time(), 'seen' => time()];
    check(booking_authenticated($config), 'Valid admin rejected');
    $_SESSION['booking_admin']['seen'] = time() - 1201;
    check(!booking_authenticated($config), 'Expired session accepted');
    // Concurrent writers must not lose updates or corrupt JSON.
    if (function_exists('pcntl_fork')) {
        $children = [];
        for ($index = 0; $index < 6; $index++) {
            $pid = pcntl_fork();
            if ($pid === 0) { for ($n = 0; $n < 5; $n++) booking_store($config, function (&$state) { $state['counter'] = ($state['counter'] ?? 0) + 1; }); exit(0); }
            $children[] = $pid;
        }
        foreach ($children as $pid) { pcntl_waitpid($pid, $status); check(pcntl_wexitstatus($status) === 0, 'Concurrent writer failed'); }
        check(booking_store($config, fn (&$state) => $state['counter']) === 30, 'Concurrent writes lost');
    }
    fwrite(STDOUT, "OK: dias úteis, bloqueios, validação, idempotência, concorrência, sessão, limite de tentativas e e-mail HTML.\n");
} finally {
    foreach (glob($private . '/*') ?: [] as $path) unlink($path);
    rmdir($private);
}
