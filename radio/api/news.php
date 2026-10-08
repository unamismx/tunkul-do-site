<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');
$base = dirname(__DIR__);
$content = json_decode((string)@file_get_contents($base.'/data/content.json'), true) ?: [];
$cache = $base.'/data/news-cache.json';
if (is_file($cache) && time() - filemtime($cache) < 900) { readfile($cache); exit; }
function get_feed(string $url): string {
  if (!preg_match('#^https?://#i', $url)) return '';
  if (function_exists('curl_init')) { $c=curl_init($url); curl_setopt_array($c,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>true,CURLOPT_CONNECTTIMEOUT=>4,CURLOPT_TIMEOUT=>8,CURLOPT_USERAGENT=>'Radio-Tunkul/1.0']); $r=(string)curl_exec($c); curl_close($c); return $r; }
  return (string)@file_get_contents($url, false, stream_context_create(['http'=>['timeout'=>8,'header'=>'User-Agent: Radio-Tunkul/1.0']]));
}
$items=[];
foreach (($content['sources'] ?? []) as $source) {
  if (!is_array($source) || empty($source['url']) || empty($source['name'])) continue;
  libxml_use_internal_errors(true); $xml=@simplexml_load_string(get_feed((string)$source['url'])); if (!$xml) continue;
  $nodes = isset($xml->channel->item) ? $xml->channel->item : (isset($xml->entry) ? $xml->entry : []);
  $n=0; foreach ($nodes as $node) { if ($n++ >= 4) break; $link=(string)($node->link ?? ''); if (isset($node->link['href'])) $link=(string)$node->link['href']; $items[]=['title'=>trim(strip_tags((string)$node->title)),'link'=>$link,'date'=>(string)($node->pubDate ?? $node->updated ?? ''),'source'=>(string)$source['name']]; }
}
usort($items, fn($a,$b)=>strtotime($b['date']?:'0') <=> strtotime($a['date']?:'0'));
$out=json_encode(['items'=>array_slice($items,0,8),'updated'=>gmdate('c')], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
file_put_contents($cache.'.tmp',$out,LOCK_EX); rename($cache.'.tmp',$cache); echo $out;
