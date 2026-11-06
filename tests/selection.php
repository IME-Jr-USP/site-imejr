<?php
declare(strict_types=1);
require __DIR__ . '/../public/api/_booking.php';
require __DIR__ . '/../public/api/_selection.php';
function ensure(bool $value, string $message): void { if (!$value) throw new RuntimeException($message); }
function denied(callable $callback, int $status): void {
    try { $callback(); } catch (BookingError $error) { ensure($error->status === $status, $error->getMessage()); return; }
    throw new RuntimeException('Expected rejection ' . $status);
}
$state = ['slots' => ['existing-slot' => ['open' => true]], 'rates' => []];
$resource = ['title' => 'Case A', 'description' => 'Orientações para o estudo de caso.', 'kind' => 'case', 'url' => 'https://example.org/case-a.pdf', 'visible' => true, 'id' => ''];
ensure(selection_public(selection_default()) === ['published' => false], 'Draft details exposed');
denied(fn () => selection_url('javascript:alert(1)'), 422);
denied(fn () => selection_url('https://user:password@example.org/private'), 422);
denied(fn () => selection_resource(array_replace($resource, ['visible' => 'true']), 'id'), 422);
denied(function () use (&$state) { selection_change($state, 'selection-publish', ['published' => true, 'revision' => 0]); }, 422);
selection_change($state, 'selection-save-resource', $resource + ['revision' => 0]);
ensure($state['selection']['revision'] === 1, 'Revision missing');
$id = $state['selection']['resources'][0]['id'];
denied(function () use (&$state, $resource) { selection_change($state, 'selection-save-resource', $resource + ['revision' => 0]); }, 409);
selection_change($state, 'selection-settings', ['title' => 'Materiais 2026', 'edition' => '2026.2', 'introduction' => 'Orientações.', 'revision' => 1]);
selection_change($state, 'selection-publish', ['published' => true, 'revision' => 2]);
selection_change($state, 'selection-save-resource', array_replace($resource, ['title' => 'Modelo de apresentação', 'kind' => 'modelo', 'url' => 'https://example.org/modelo', 'visible' => false, 'revision' => 3]));
$hiddenId = $state['selection']['resources'][1]['id'];
$public = selection_public($state['selection']);
ensure(count($public['resources']) === 1 && !str_contains(json_encode($public), 'https://example.org/modelo'), 'Hidden material exposed');
ensure(!isset($public['revision']) && !isset($public['resources'][0]['visible']), 'Administrative metadata exposed');
selection_change($state, 'selection-toggle-resource', ['id' => $hiddenId, 'revision' => 4]);
selection_change($state, 'selection-move-resource', ['id' => $hiddenId, 'direction' => 'up', 'revision' => 5]);
ensure(selection_public($state['selection'])['resources'][0]['id'] === $hiddenId, 'Order not persisted');
selection_change($state, 'selection-save-resource', array_replace($resource, ['id' => $id, 'title' => 'Case A atualizado', 'revision' => 6]));
ensure($state['selection']['resources'][1]['title'] === 'Case A atualizado', 'Edit failed');
selection_change($state, 'selection-remove-resource', ['id' => $id, 'revision' => 7]);
ensure(count($state['selection']['resources']) === 1, 'Removal failed');
selection_change($state, 'selection-publish', ['published' => false, 'revision' => 8]);
ensure(selection_public($state['selection']) === ['published' => false], 'Unpublished links exposed');
ensure($state['slots'] === ['existing-slot' => ['open' => true]], 'Selection changed booking availability');
echo "OK: rascunho, publicação, links, edição, ordem, visibilidade, exclusão e proteção contra sobrescrita.\n";
