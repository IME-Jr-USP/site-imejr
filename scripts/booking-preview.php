<?php
// Router for the static export + PHP API on the local development server.
if (PHP_SAPI !== 'cli-server') { http_response_code(404); exit; }
if (!getenv('IMEJR_BOOKING_CONFIG')) putenv('IMEJR_BOOKING_CONFIG=' . __DIR__ . '/../.booking-private/booking.php');
$uri = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');
$root = realpath(__DIR__ . '/../out');
$path = realpath($root . $uri);
if (!$path || !str_starts_with($path . '/', $root . '/') || str_contains($uri, '/.')) { http_response_code(404); exit; }
if (is_dir($path)) {
    if (is_file($path . '/index.html')) { header('Content-Type: text/html; charset=utf-8'); readfile($path . '/index.html'); exit; }
    http_response_code(404); exit;
}
if (str_ends_with($path, '.php')) { $_SERVER['SCRIPT_FILENAME'] = $path; require $path; exit; }
return false;
