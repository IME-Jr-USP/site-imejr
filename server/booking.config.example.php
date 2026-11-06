<?php
// Copy OUTSIDE public_html; never publish credentials or the JSON store.
return [
    'environment' => 'production',
    'secret' => 'REPLACE_WITH_AT_LEAST_32_RANDOM_CHARACTERS',
    'admins' => ['equipe' => 'REPLACE_WITH_PASSWORD_HASH'],
    'origins' => ['https://imejr.com', 'https://www.imejr.com'],
    'storage_dir' => __DIR__,
    // Add local holidays, recesses and other unavailable dates here.
    'blocked_dates' => [],
];
