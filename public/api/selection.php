<?php
declare(strict_types=1);
require __DIR__ . '/_booking.php';
require __DIR__ . '/_selection.php';
try {
    $config = booking_bootstrap();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') { header('Allow: GET'); throw new BookingError(405, 'Método não permitido.'); }
    booking_limit($config, 'selection-read', 90, 60);
    $page = booking_store($config, fn (&$state) => selection_public($state['selection'] ?? selection_default()));
    booking_json($page);
} catch (BookingError $error) { booking_json(['message' => $error->status === 503 ? 'Os materiais não estão disponíveis agora. Tente novamente em alguns instantes.' : $error->getMessage()], $error->status); }
catch (Throwable $error) { error_log('IME Jr selection: ' . get_class($error)); booking_json(['message' => 'Não foi possível carregar os materiais agora.'], 503); }
