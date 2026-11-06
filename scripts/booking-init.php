<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') exit(1);
$directory = $argv[1] ?? '';
$user = $argv[2] ?? 'equipe';
$development = in_array('--local', $argv, true);
if (!$directory || $directory[0] !== '/' || !preg_match('/^[a-zA-Z0-9._-]{1,80}$/', $user)) {
    fwrite(STDERR, "Uso: php scripts/booking-init.php /caminho/privado usuario [--local]\n"); exit(1);
}
if (is_file($directory . '/booking.php')) { fwrite(STDERR, "A configuração já existe; nada foi sobrescrito.\n"); exit(1); }
if (!is_dir($directory) && !mkdir($directory, 0700, true)) exit(1);
chmod($directory, 0700);
$password = bin2hex(random_bytes(16));
$config = ['environment' => $development ? 'development' : 'production', 'secret' => bin2hex(random_bytes(32)), 'admins' => [$user => password_hash($password, PASSWORD_DEFAULT)], 'origins' => $development ? ['http://127.0.0.1:8080', 'http://localhost:8080'] : ['https://imejr.com', 'https://www.imejr.com'], 'storage_dir' => realpath($directory), 'blocked_dates' => []];
file_put_contents($directory . '/booking.php', "<?php\nreturn " . var_export($config, true) . ";\n");
chmod($directory . '/booking.php', 0600);
fwrite(STDOUT, "Configuração privada criada em $directory/booking.php\nUsuário: $user\nSenha (guarde em um gerenciador; exibida apenas agora): $password\n");
