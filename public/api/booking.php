<?php
declare(strict_types=1);
require __DIR__ . '/_booking.php';
try {
    $config = booking_bootstrap();
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if ($method === 'GET') {
        booking_limit($config, 'availability', 60, 60);
        $area = $_GET['area'] ?? 'geral';
        if (!is_string($area)) throw new BookingError(422, 'Área inválida.');
        if (!booking_area($area)) throw new BookingError(422, 'Área inválida.');
        $slots = booking_store($config, function (&$state) use ($config, $area) {
            return array_values(array_filter($state['slots'], fn ($s) => $s['open'] && booking_day($s['date'], $config) && ($s['area'] === 'geral' || $s['area'] === $area)));
        });
        $unique = [];
        foreach ($slots as $slot) {
            $key = $slot['date'] . ':' . $slot['time'];
            if (!isset($unique[$key]) || $slot['area'] === $area) $unique[$key] = $slot;
        }
        $slots = array_map(fn ($slot) => array_intersect_key($slot, array_flip(['id', 'date', 'time', 'end', 'area', 'open'])), array_values($unique));
        usort($slots, fn ($a, $b) => [$a['date'], $a['time']] <=> [$b['date'], $b['time']]);
        booking_json(['slots' => $slots, 'csrf' => $_SESSION['booking_csrf'], 'today' => date('Y-m-d'), 'until' => date('Y-m-d', strtotime('+45 days')), 'timezone' => 'America/Sao_Paulo']);
    }
    if ($method !== 'POST') { header('Allow: GET, POST'); throw new BookingError(405, 'Método não permitido.'); }
    $data = booking_input();
    booking_limit($config, 'submit', 3, 3600);
    booking_limit($config, 'submit-global', 45, 86400, true);
    if (!empty($data['website'])) throw new BookingError(422, 'Não foi possível enviar a solicitação.');
    $input = booking_validate($data);
    $prepared = booking_store($config, fn (&$state) => booking_prepare($state, $input, $config));
    if ($prepared['send']) {
        $sent = false;
        try { $sent = booking_send($config, $prepared['request']); }
        catch (Throwable $error) { error_log('IME Jr booking: email send failed'); }
        booking_finish($config, $prepared['key'], $sent);
        if (!$sent) throw new BookingError(503, 'Não foi possível enviar o e-mail agora. Seus dados continuam neste formulário; tente novamente ou escreva para contato@imejr.com.');
    }
    booking_json(['ok' => true, 'reference' => substr($prepared['id'], 0, 8), 'message' => 'Solicitação enviada. A equipe responderá por e-mail para confirmar o horário e enviar o convite.'], $prepared['send'] ? 201 : 200);
} catch (BookingError $error) { booking_json(['ok' => false, 'message' => $error->getMessage(), 'reason' => $error->reason], $error->status); }
catch (Throwable $error) { error_log('IME Jr booking: ' . get_class($error)); booking_json(['ok' => false, 'message' => 'Não foi possível concluir agora. Tente novamente ou escreva para contato@imejr.com.'], 503); }
