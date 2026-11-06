<?php
declare(strict_types=1);
require __DIR__ . '/_booking.php';
require __DIR__ . '/_selection.php';
try {
    $config = booking_bootstrap();
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if ($method === 'GET') {
        $authenticated = booking_authenticated($config);
        $businessDates = booking_business_dates($config);
        $result = ['authenticated' => $authenticated, 'csrf' => $_SESSION['booking_csrf'], 'today' => date('Y-m-d'), 'until' => date('Y-m-d', strtotime('+45 days')), 'first_day' => $businessDates[0] ?? null, 'business_dates' => $businessDates];
        if ($authenticated) {
            $result += booking_store($config, function (&$state) {
                $slots = array_values($state['slots']);
                usort($slots, fn ($a, $b) => [$a['date'], $a['time'], $a['area']] <=> [$b['date'], $b['time'], $b['area']]);
                return ['slots' => $slots, 'selection' => $state['selection'] ?? selection_default()];
            });
        }
        booking_json($result);
    }
    if ($method !== 'POST') { header('Allow: GET, POST'); throw new BookingError(405, 'Método não permitido.'); }
    $data = booking_input();
    $action = $data['action'] ?? '';
    if ($action === 'login') {
        booking_limit($config, 'admin-login', 5, 900);
        $user = booking_text($data['user'] ?? '', 1, 80);
        $password = booking_text($data['password'] ?? '', 1, 256);
        $hash = $config['admins'][$user] ?? '$2y$10$BszO1Byg1ovoy9y1rcyMGOJMHmj5Wr20qupyWDw7tk8l.Hoz6kRGe';
        $verified = password_verify($password, $hash);
        if (!$verified || !isset($config['admins'][$user])) throw new BookingError(401, 'Usuário ou senha inválidos.');
        session_regenerate_id(true);
        $_SESSION['booking_admin'] = ['user' => $user, 'version' => hash('sha256', $hash), 'created' => time(), 'seen' => time()];
        $_SESSION['booking_csrf'] = bin2hex(random_bytes(32));
        booking_json(['ok' => true, 'csrf' => $_SESSION['booking_csrf']]);
    }
    if (!booking_authenticated($config)) throw new BookingError(401, 'Entre novamente para acessar o painel.');
    booking_limit($config, 'admin-write', 120, 3600);
    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => '/', 'secure' => ($config['environment'] ?? '') !== 'development', 'httponly' => true, 'samesite' => 'Strict']);
        booking_json(['ok' => true]);
    }
    if (is_string($action) && str_starts_with($action, 'selection-')) {
        $message = booking_store($config, fn (&$state) => selection_change($state, $action, $data));
        booking_json(['ok' => true, 'message' => $message]);
    }
    if ($action === 'add') {
        $count = booking_store($config, fn (&$state) => booking_admin_slots($state, $data, $config));
        booking_json(['ok' => true, 'created_count' => $count, 'message' => $count > 0 ? $count . ' horário(s) publicado(s). Confira abaixo o dia cadastrado.' : 'Nenhum horário novo: esse período já está cadastrado para a área selecionada. Se algum estiver fechado, use Reabrir na lista abaixo.']);
    }
    if ($action === 'close-day') {
        $date = booking_text($data['date'] ?? '', 10, 10);
        $day = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
        if (!$day || $day->format('Y-m-d') !== $date) throw new BookingError(422, 'Data inválida.');
        $count = booking_store($config, function (&$state) use ($date) {
            $count = 0;
            foreach ($state['slots'] as &$slot) {
                if ($slot['date'] === $date && $slot['open']) { $slot['open'] = false; $slot['updated_by'] = $_SESSION['booking_admin']['user']; $count++; }
            }
            return $count;
        });
        booking_json(['ok' => true, 'message' => $count . ' horário(s) fechado(s).']);
    }
    $id = booking_text($data['id'] ?? '', 32, 32);
    if ($action === 'toggle') {
        booking_store($config, function (&$state) use ($id) {
            if (!isset($state['slots'][$id])) throw new BookingError(404, 'Horário não encontrado.');
            $state['slots'][$id]['open'] = !$state['slots'][$id]['open'];
            $state['slots'][$id]['updated_by'] = $_SESSION['booking_admin']['user'];
        });
        booking_json(['ok' => true]);
    }
    throw new BookingError(400, 'Ação inválida.');
} catch (BookingError $error) { booking_json(['ok' => false, 'message' => $error->getMessage()], $error->status); }
catch (Throwable $error) { error_log('IME Jr booking admin: ' . get_class($error)); booking_json(['ok' => false, 'message' => 'Painel indisponível. Confira a configuração privada do painel.'], 503); }
