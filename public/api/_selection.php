<?php
declare(strict_types=1);

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }

function selection_default(): array {
    return [
        'title' => 'Materiais do Processo Seletivo',
        'edition' => '',
        'introduction' => 'Acesse os cases e os materiais de apoio desta etapa do processo seletivo da IME Jr. Siga as orientações e os prazos informados pela equipe.',
        'published' => false,
        'resources' => [],
        'revision' => 0,
    ];
}

function selection_url(mixed $value): string {
    $url = booking_text($value, 8, 2000);
    $parts = parse_url($url);
    if (!filter_var($url, FILTER_VALIDATE_URL) || !$parts || !in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true) || isset($parts['user']) || isset($parts['pass'])) {
        throw new BookingError(422, 'Informe um link http ou https válido, sem usuário ou senha na URL.');
    }
    return $url;
}

function selection_resource(array $data, string $id): array {
    $kind = booking_text($data['kind'] ?? '', 4, 10);
    if (!in_array($kind, ['case', 'modelo', 'material'], true)) throw new BookingError(422, 'Selecione o tipo de material.');
    if (!is_bool($data['visible'] ?? null)) throw new BookingError(422, 'Defina a visibilidade do material.');
    return [
        'id' => $id,
        'title' => booking_text($data['title'] ?? '', 2, 160),
        'description' => booking_text($data['description'] ?? '', 0, 1000),
        'kind' => $kind,
        'url' => selection_url($data['url'] ?? ''),
        'visible' => $data['visible'],
    ];
}

function selection_change(array &$state, string $action, array $data): string {
    $page = $state['selection'] ?? selection_default();
    if (!is_int($data['revision'] ?? null) || $data['revision'] !== $page['revision']) {
        throw new BookingError(409, 'O processo seletivo foi alterado em outra sessão. O painel foi atualizado; confira o conteúdo antes de salvar novamente.');
    }
    $message = 'Alteração salva.';
    if ($action === 'selection-settings') {
        $page['title'] = booking_text($data['title'] ?? '', 2, 160);
        $page['edition'] = booking_text($data['edition'] ?? '', 0, 80);
        $page['introduction'] = booking_text($data['introduction'] ?? '', 0, 2500);
        $message = 'Apresentação do processo seletivo salva.';
    } elseif ($action === 'selection-publish') {
        if (!is_bool($data['published'] ?? null)) throw new BookingError(422, 'Defina o estado da página.');
        if ($data['published'] && !array_filter($page['resources'], fn ($item) => $item['visible'])) {
            throw new BookingError(422, 'Cadastre pelo menos um material visível antes de publicar a página.');
        }
        $page['published'] = $data['published'];
        $message = $page['published'] ? 'Página publicada. Os materiais visíveis já podem ser acessados pelo link público.' : 'Página ocultada. Os links deixaram de aparecer na página pública.';
    } elseif ($action === 'selection-save-resource') {
        $id = $data['id'] ?? '';
        if (!is_string($id) || ($id !== '' && !preg_match('/^[a-f0-9]{32}$/', $id))) throw new BookingError(422, 'Material inválido.');
        if ($id === '') {
            if (count($page['resources']) >= 40) throw new BookingError(422, 'O limite é de 40 materiais por processo seletivo.');
            $page['resources'][] = selection_resource($data, bin2hex(random_bytes(16)));
            $message = 'Link cadastrado.';
        } else {
            $found = false;
            foreach ($page['resources'] as &$item) {
                if ($item['id'] === $id) { $item = selection_resource($data, $id); $found = true; break; }
            }
            unset($item);
            if (!$found) throw new BookingError(404, 'Material não encontrado.');
            $message = 'Material atualizado.';
        }
    } elseif (in_array($action, ['selection-toggle-resource', 'selection-remove-resource', 'selection-move-resource'], true)) {
        $id = booking_text($data['id'] ?? '', 32, 32);
        $index = null;
        foreach ($page['resources'] as $position => $item) if ($item['id'] === $id) { $index = $position; break; }
        if ($index === null) throw new BookingError(404, 'Material não encontrado.');
        if ($action === 'selection-toggle-resource') {
            $page['resources'][$index]['visible'] = !$page['resources'][$index]['visible'];
            $message = $page['resources'][$index]['visible'] ? 'Material definido como visível.' : 'Material ocultado.';
        } elseif ($action === 'selection-remove-resource') {
            array_splice($page['resources'], $index, 1);
            $message = 'Link removido do processo seletivo.';
        } else {
            if (!in_array($data['direction'] ?? null, ['up', 'down'], true)) throw new BookingError(422, 'Direção inválida.');
            $next = $index + ($data['direction'] === 'up' ? -1 : 1);
            if (isset($page['resources'][$next])) {
                [$page['resources'][$index], $page['resources'][$next]] = [$page['resources'][$next], $page['resources'][$index]];
            }
            $message = 'Ordem dos materiais atualizada.';
        }
    } else { throw new BookingError(400, 'Ação inválida.'); }
    $page['revision']++;
    $state['selection'] = $page;
    return $message;
}

function selection_public(array $page): array {
    if (!$page['published']) return ['published' => false];
    $public = array_intersect_key($page, array_flip(['title', 'edition', 'introduction', 'published']));
    $public['resources'] = array_map(fn ($item) => array_intersect_key($item, array_flip(['id', 'title', 'description', 'kind', 'url'])), array_values(array_filter($page['resources'], fn ($item) => $item['visible'])));
    return $public;
}
