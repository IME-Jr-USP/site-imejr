# Site IME Jr

Site institucional da **IME Jr — Empresa Júnior do IME-USP**, com páginas de Computação e Dados, atividades, solicitação de reuniões e uma central administrativa compartilhada pela equipe.

O front-end usa **Next.js 14, React, TypeScript e Tailwind CSS**, com exportação estática. Os recursos dinâmicos usam **PHP** na hospedagem: autenticação, disponibilidade da agenda, envio de e-mail e publicação dos materiais do processo seletivo.

## Requisitos

- Node.js e npm para instalar as dependências e gerar o site.
- PHP **8.2 ou superior**, com sessões, JSON, hash e `mbstring`, para o painel e as APIs.
- Python 3 somente para executar o teste de integração HTTP.

Em produção, o site usa o conteúdo de `out/` e os endpoints PHP. Não é necessário manter um servidor Node.js em execução. A agenda e os materiais usam arquivos privados; a implementação atual não exige banco de dados.

## Instalação

Na raiz do repositório:

```bash
npm ci
```

### Prévia visual do front-end

```bash
npm run dev
```

Abra o endereço exibido no terminal, normalmente `http://localhost:3000`.

Esse servidor não executa PHP. Para usar o login administrativo, o calendário e os materiais dinâmicos do processo seletivo, utilize a prévia completa abaixo.

### Prévia completa com PHP

```bash
npm run build

# Inicialize o acesso somente se a configuração local ainda não existir.
if [ ! -f .booking-private/booking.php ]; then
  php scripts/booking-init.php "$PWD/.booking-private" equipe --local
fi

npm run booking:preview
```

| Endereço local | Função |
| --- | --- |
| `http://127.0.0.1:8080/` | Site institucional |
| `http://127.0.0.1:8080/admin/` | Central administrativa |
| `http://127.0.0.1:8080/agendamento/` | Solicitação de reunião |
| `http://127.0.0.1:8080/processo-seletivo/` | Materiais publicados para os candidatos |

O usuário compartilhado é **`equipe`**. A senha aleatória é exibida no terminal apenas na inicialização; guarde-a em um gerenciador de senhas. O inicializador não sobrescreve uma configuração existente. Atualizar o código ou gerar outro build não exige recriar o acesso.

No modo local, os e-mails são gravados em `.booking-private/email-*.html`: **nenhum e-mail real é enviado**. Essa pasta contém configuração privada e dados locais e está excluída do Git.

A prévia PHP serve os arquivos gerados em `out/`. Após alterar o código, rode `npm run build` novamente e atualize o navegador. Para encerrar qualquer um dos servidores locais, use `Ctrl+C`.

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Destaque do legado, Quem Somos, serviços, equipe e contato |
| `/servicos/computacao/` | Soluções de Computação |
| `/servicos/dados/` | Soluções de Dados |
| `/atividades/` | IMEnsina, palestras com empresas, aMostra e Semana da Computação |
| `/agendamento/` | Escolha de horários e formulário do projeto |
| `/admin/` | Agenda e Processo Seletivo, com login compartilhado |
| `/agendamento/admin/` | Endereço anterior, que abre a mesma central administrativa |
| `/processo-seletivo/` | Cases, modelos e materiais liberados pelo painel |

A IME Jr mantém **três áreas de atuação: Computação, Dados e Educação**. A oferta de serviços do site apresenta Computação e Dados; Educação permanece representada pelas iniciativas institucionais.

## Central administrativa

Acesse `/admin/` com a conta compartilhada da equipe. Não há cadastro individual de administradores. A senha fica como hash na configuração privada, fora dos arquivos públicos e do Git. Para instalação em produção e troca da senha, consulte o [guia da agenda e do painel](server/AGENDAMENTO.md).

### Agendamentos

- Publique horários de 30 minutos para Computação, Dados ou ambas as áreas, em um dia ou intervalo de datas.
- O calendário usa datas brasileiras e horários de 24 horas. Aceita dias úteis futuros, do dia seguinte até 45 dias à frente.
- Fins de semana e feriados nacionais de data fixa são excluídos. Feriados locais, móveis e recessos devem ser cadastrados em `blocked_dates`, na configuração privada.
- Feche um horário ou um dia inteiro quando necessário; horários fechados podem ser reabertos pelo painel.
- O visitante escolhe **de uma a três opções**, informa seus dados, descreve o projeto e pode incluir até cinco links de referência.

As opções são **sugestões, não reservas automáticas**. A equipe confirma um horário por e-mail, envia o convite e fecha o horário escolhido no painel.

O formulário é encaminhado como e-mail HTML para `contato@imejr.com`. **Não há histórico de pedidos no painel nem armazenamento do conteúdo dos formulários no arquivo de dados da aplicação.** Apenas controles técnicos temporários contra abuso e duplicação são mantidos. Se o servidor não aceitar o envio, o formulário informa a falha e permite tentar novamente. Aceite pelo servidor não comprova entrega na caixa de entrada.

### Processo Seletivo

A aba **Processo Seletivo** permite:

- Editar título, edição e orientações para os candidatos.
- Cadastrar links de cases, modelos de apresentação e outros materiais.
- Editar, reordenar, ocultar ou excluir materiais.
- Publicar ou ocultar a página e copiar seu endereço para compartilhar.

A página começa **oculta** e exige pelo menos um material visível para publicação. A API pública entrega apenas os materiais visíveis quando a página está publicada. Alterações simultâneas em sessões diferentes são detectadas para evitar sobrescritas silenciosas.

Os arquivos permanecem no Drive ou no serviço indicado pelos links; não há upload de documentos pelo painel. Confira as permissões de acesso antes de compartilhar. Ocultar um material no site não revoga o acesso ao arquivo externo.

A rota `/processo-seletivo/` é uma página de materiais, não um formulário de inscrição. Ela é pública quando publicada e usa `noindex`, `nofollow` e `noimageindex`; essas regras de busca não substituem controle de acesso aos documentos.

## Atualizar textos, imagens e redes sociais

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `src/components/Hero.tsx` | Destaque da inicial, restaurado do legado |
| `src/components/Sobre.tsx` | Apresentação institucional e indicadores |
| `src/app/atividades/page.tsx` | Introdução, palestras e ordem das quatro atividades |
| `src/data/initiatives.ts` | Textos, links e referências das imagens das atividades |
| `public/atividades/` | Artes de IMEnsina, palestras, aMostra e Semana da Computação |
| `src/data/socials.ts` | Links das redes, compartilhados pela página de Atividades e pelo rodapé |
| `src/data/navigation.ts` | Links de navegação e opções do menu Serviços |
| `src/app/globals.css` | Estilos globais e tipografia |

As imagens de Atividades usam a proporção **16:9**, alternam de lado entre as linhas e não exibem legendas. Para substituí-las, atualize o arquivo em `public/atividades/` ou o caminho `media.src` e o texto acessível `media.alt`. O título de Palestras com empresas leva a `/#contato`, na mesma aba.

A identidade usa preto, branco e amarelo. Os títulos usam Inter em peso forte; a tipografia secundária usa caixa alta e letras espaçadas.

Os horários e os materiais editados pelo painel ficam no armazenamento privado do servidor e não são versionados no Git.

## Verificações

```bash
npm run test:admin
npm run build
python3 tests/booking-http.py
```

- `test:admin`: valida as regras da agenda e do processo seletivo, incluindo visibilidade e controle de versão.
- `build`: compila, verifica tipos e gera a exportação estática.
- O teste HTTP inicia seu próprio servidor PHP em loopback e utiliza configuração descartável. Verifica autenticação compartilhada, CSRF, publicação/ocultação de materiais, disponibilidade, envio sem histórico e logout. Os e-mails são capturados em arquivos temporários.

Os testes não precisam da senha real da equipe nem da configuração local existente. A entrega real de e-mail e as regras do Apache/LiteSpeed precisam ser verificadas na hospedagem.

## Publicação na Hostinger

O fluxo de publicação é manual; o build e o envio do código ao GitHub são etapas separadas da instalação na hospedagem.

1. Siga a [configuração de produção](server/AGENDAMENTO.md#configuração-em-produção): PHP, HTTPS, conta compartilhada e pasta privada fora de `public_html`.
2. Gere a versão de produção com `npm run build`.
3. Envie **todo o conteúdo de `out/`** para `public_html`, incluindo `api/` e o arquivo oculto `.htaccess`.
4. Preserve a pasta privada existente ao atualizar: ela contém a configuração do acesso, os horários e os materiais do processo seletivo. Faça backup separado dessa pasta, com acesso restrito.
5. Confira o login em `/admin/`, os horários em `/agendamento/`, a publicação dos materiais em `/processo-seletivo/` e o recebimento de uma solicitação de teste em `contato@imejr.com`.

Não envie `node_modules/`, `.next/`, `scripts/`, `server/`, `tests/` ou `.booking-private/` para a área pública. A configuração de produção deve usar `environment=production`, os domínios HTTPS corretos e um caminho privado permitido pelo PHP da conta; não reutilize a configuração de desenvolvimento como configuração de produção.

A configuração privada padrão fica em `imejr-private/booking.php`, ao lado de `public_html`. Outro caminho pode ser definido por `IMEJR_BOOKING_CONFIG`. O exemplo sem credenciais está em [server/booking.config.example.php](server/booking.config.example.php).

A página antiga de serviços de Educação foi removida. Ao atualizar uma instalação anterior, remova `servicos/educacao/` se ainda estiver publicado. A pasta legada `processo-seletivo-files/` não é mais gerada; antes de removê-la da hospedagem, confira se algum material ativo ainda aponta para seus arquivos. Substituir arquivos não exclui caminhos antigos automaticamente.

`npm start` não serve este projeto em modo de exportação estática. Use a prévia PHP local ou a hospedagem configurada para servir o conteúdo de `out/` e executar os endpoints PHP.

## Fotos e indexação no Google

As páginas incluem `noimageindex`. O painel e a página de materiais do processo seletivo também incluem `noindex` e `nofollow`. As demais páginas institucionais continuam marcadas como indexáveis.

`public/.htaccess` configura o cabeçalho **`X-Robots-Tag: noindex, noimageindex`** nos arquivos de imagem, incluindo fotos da equipe e artes de Atividades. O build copia essa regra para `out/.htaccess`.

A proteção só passa a valer no site publicado quando a hospedagem aplica o `.htaccess` com `mod_headers`. Os servidores de desenvolvimento Next e PHP não executam essas regras. Após publicar, confira, por exemplo:

```bash
curl -I https://imejr.com/fotos-lideres/equipe.jpeg
curl -I https://imejr.com/atividades/imensina.jpg
```

As respostas devem incluir `X-Robots-Tag: noindex, noimageindex`. Se houver CDN/proxy, valide também seus cabeçalhos e cache.

Não bloqueie simultaneamente essas imagens em `robots.txt`: o Google precisa rastreá-las para ler o cabeçalho `noindex`. Imagens já indexadas dependem de novo rastreamento; a ferramenta Remoções do Search Console pode acelerar a retirada. As regras não tornam as fotos privadas nem controlam cópias hospedadas em outros sites. Consulte a [orientação oficial do Google](https://developers.google.com/search/docs/crawling-indexing/prevent-images-on-your-page).
