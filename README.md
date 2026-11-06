# Site IME Jr

Site institucional da IME Jr — Empresa Júnior do IME-USP, desenvolvido com Next.js 14, React, TypeScript e Tailwind CSS.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço indicado no terminal (normalmente `http://localhost:3000`).

## Páginas e conteúdo

- `/`: apresentação, serviços de Computação e Dados, equipe e contato.
- `/servicos/computacao/` e `/servicos/dados/`: detalhes das duas áreas, acessíveis pelo menu Serviços.
- `/atividades/`: IMEnsina, palestras com empresas, aMostra e Semana da Computação.
- `/agendamento/`: solicitação de reunião com até três opções de horário.
- `/admin/`: central administrativa com acesso compartilhado da equipe, agenda e edição dos materiais do processo seletivo.
- `/agendamento/admin/`: endereço anterior, que continua abrindo a mesma central.
- `/processo-seletivo/`: página dos candidatos, com cases e materiais publicados pelo painel; sem indexação no Google.

O destaque da inicial reproduz o componente original do legado. A identidade usa preto, branco e amarelo nos destaques, com Inter em peso forte nos títulos. A tipografia secundária usa Inter em caixa alta, peso semibold e espaçamento de 0,2 em entre letras, aplicada a rótulos e destaques. A página de Atividades mantém seções abertas e áreas reservadas para imagens, incluindo palestras e visitas a empresas.

### Atualizar Atividades

Os textos, links e referências de mídia estão em `src/data/initiatives.ts`; `talksMedia` controla a imagem reservada da seção de palestras e visitas. Para substituir uma imagem reservada, coloque o arquivo em `public/` e preencha `media.src` com o caminho público, por exemplo `/atividades/amostra.jpg`. Atualize também `media.alt`. As imagens não exibem legendas abaixo delas. As áreas sem imagem são identificadas como placeholders; o destaque do YouTube leva ao canal completo, sem simular um vídeo específico.

A introdução e as quatro linhas alternadas estão em `src/app/atividades/page.tsx`. O título de Palestras com empresas leva à seção de contato da página inicial, na mesma aba. Não há programação ou inscrições fictícias.

## Build e publicação na Hostinger

```bash
npm run build
```

O projeto usa `output: "export"`: o build cria `out/`, com HTML, CSS, JS e arquivos públicos. Envie **todo o conteúdo de `out/`** para `public_html`, incluindo o arquivo oculto `.htaccess`. Ao atualizar a versão anterior, remova da hospedagem os caminhos antigos `servicos/educacao/` e `processo-seletivo-files/`, caso existam, pois substituir arquivos não exclui páginas e materiais antigos.

`npm run dev` serve para visualizar as páginas. O envio de contato e a agenda dependem de PHP; não são executados pelo servidor Next local. Para instalar a agenda, configurar o acesso administrativo e testar o fluxo completo em loopback, siga [server/AGENDAMENTO.md](server/AGENDAMENTO.md). `npm start` não atende a exportação estática.

## Agendamento

A central `/admin/` administra disponibilidades e materiais do processo seletivo em uma pasta privada fora de `public_html`. Os formulários são enviados apenas por e-mail HTML para `contato@imejr.com`, sem histórico de pedidos no painel. São mantidos apenas controles técnicos temporários contra duplicação e abuso, sem o conteúdo do formulário. A escolha de horários é uma proposta, não uma reserva automática. A equipe confirma o horário e envia o convite. Há configuração obrigatória na hospedagem antes da ativação; consulte o [guia da agenda](server/AGENDAMENTO.md).

## Fotos e indexação

As páginas incluem `noimageindex` em suas metatags de robôs. As páginas públicas continuam indexáveis.

`public/.htaccess` configura `X-Robots-Tag: noindex, noimageindex` nas respostas de arquivos de imagem (incluindo as fotos da equipe). Essa regra vale na hospedagem Apache/LiteSpeed com `mod_headers`, não no servidor `npm run dev`. O build copia o arquivo para `out/.htaccess`.

Não bloqueie simultaneamente essas imagens em `robots.txt`: os buscadores precisam acessar os arquivos para ler o cabeçalho `noindex`. [Orientação oficial do Google](https://developers.google.com/search/docs/crawling-indexing/prevent-images-on-your-page).

Após publicar, confira o cabeçalho na hospedagem:

```bash
curl -I https://imejr.com/fotos-lideres/equipe.jpeg
```

A resposta deve incluir `X-Robots-Tag: noindex, noimageindex`. Se a hospedagem não servir `.htaccess` ou usar CDN/proxy, configure o mesmo cabeçalho nesse serviço e limpe o cache das imagens. A política só passa a valer no site público após a publicação. Imagens já indexadas precisam ser rastreadas novamente pelo Google; para remoção mais rápida, o proprietário pode usar a ferramenta Remoções no Search Console. Isso controla a indexação, não o acesso às fotos por visitantes ou cópias hospedadas em terceiros.

## Painel e processo seletivo

Acesse `/admin/` com o usuário compartilhado `equipe` e a senha já configurada. A sessão é a mesma da agenda anterior; não há cadastro individual. A aba **Processo Seletivo** permite editar título, edição e orientações, cadastrar links de cases/modelos/materiais, reordenar, editar, ocultar e excluir itens. A página começa oculta e é publicada pelo próprio painel.

Os arquivos continuam no Drive ou no serviço indicado pelos links; confira suas permissões de acesso antes de compartilhar. A página `/processo-seletivo/` é pública quando publicada e permanece marcada com `noindex`, `nofollow` e `noimageindex`. Não é um formulário de inscrição. A API pública não revela rascunhos nem os links de itens ocultos. Ocultar uma página não revoga acesso a documentos externos.

Os materiais e a configuração editorial ficam na mesma pasta privada da agenda e devem integrar seu backup. Editores em sessões diferentes recebem um aviso se tentarem sobrescrever uma versão antiga. Não há histórico dos pedidos de reunião.

Verificações: `npm run test:admin`, `npm run build` e `python3 tests/booking-http.py`.
