<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');
$file = dirname(__DIR__) . '/data/content.json';
$data = is_file($file) ? json_decode((string) file_get_contents($file), true) : [];
if (!is_array($data)) $data = [];
$podcasts = array_values(array_filter($data['podcasts'] ?? [], fn($p) => is_array($p) && ($p['published'] ?? true)));
usort($podcasts, fn($a,$b) => strcmp((string)($b['date'] ?? ''), (string)($a['date'] ?? '')));
echo json_encode(['podcasts' => $podcasts], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
