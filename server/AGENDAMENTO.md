# Agenda da IME Jr

## Funcionamento

- `/agendamento/`: o visitante escolhe de 1 a 3 opções de 30 minutos, em dias úteis, do dia seguinte até 45 dias à frente. Informa nome, e-mail, área, descrição e até cinco links de referência.
- `/admin/`, aba Agendamentos (também acessível pelo endereço antigo `/agendamento/admin/`): o administrador publica disponibilidade por dia ou por intervalo de datas, para Computação, Dados ou ambas. Pode fechar um dia inteiro e fechar/reabrir horários. As datas aparecem no padrão brasileiro, com calendário em português.
- O envio encaminha o formulário diretamente a `contato@imejr.com` como e-mail HTML, sem histórico de pedidos no painel e sem salvar nome, e-mail, documentos ou descrição em arquivos de dados da aplicação. A equipe confirma uma opção por e-mail, envia o convite e fecha o horário escolhido no painel. **Não há reserva, convite de calendário ou videoconferência automáticos.** Duas pessoas podem sugerir o mesmo horário antes de a equipe confirmar uma delas.
- Se o servidor não aceitar o e-mail, o formulário mostra uma falha e mantém os campos preenchidos no navegador para nova tentativa. Não há fila privada nem cópia de segurança do pedido no painel. Aceite do servidor de e-mail não comprova entrega na caixa de entrada; a própria caixa de e-mail pode manter suas cópias conforme a política do provedor.

## Hospedagem e custo

O backend usa PHP 8.2+ e arquivos privados; não exige Node em produção, banco de dados, serviço de agendamento ou assinatura adicional. É adequado à agenda de uma equipe com baixo volume de solicitações. Escritas concorrentes são serializadas com `flock`, e os dados são substituídos com `rename` atômico. Para vários servidores ou volume alto, migre o armazenamento para MariaDB/MySQL.

A Hostinger oferece PHP em hospedagem web. Os limites publicados para `mail()` são 10 mensagens/minuto e 100/dia, compartilhados com outros scripts da conta; confirme os limites atuais do seu plano no hPanel. Esta agenda limita novas solicitações globalmente a 45/dia e notificações a 5/minuto e 70/dia. SMTP autenticado é uma evolução recomendada se houver problemas de entrega; não há promessa de entrega baseada apenas em `mail()`.

Fontes: [PHP na Hostinger](https://www.hostinger.com/support/which-programming-languages-and-frameworks-are-supported-at-hostinger/), [limites de envio e recomendação de SMTP](https://www.hostinger.com/support/11393648-php-mail-limitation-explained-how-to-improve-email-delivery-with-smtp/).

## Configuração em produção

1. Ative o SSL e a opção de forçar HTTPS na Hostinger. Use PHP 8.2 ou superior, com JSON, sessões, hash e mbstring. A configuração `.htaccess` também redireciona HTTP para `https://imejr.com` e protege contra enquadramento em sites de terceiros.
2. Crie uma pasta **fora de `public_html`**, por exemplo:

   ```text
   /home/USUARIO/domains/imejr.com/
   ├── public_html/                # conteúdo de out/
   └── imejr-private/              # nunca publicar, nunca versionar
       ├── booking.php             # configuração com hashes e segredo
       ├── booking-data.json       # criado automaticamente
       └── booking.lock            # criado automaticamente
   ```

3. Em um terminal com PHP, gere a configuração e uma senha aleatória forte:

   ```bash
   php scripts/booking-init.php /CAMINHO/PRIVADO/imejr-private equipe
   ```

   O comando cria a pasta com permissão `0700`, o arquivo com `0600` e exibe a senha **uma única vez**. Guarde-a em um gerenciador de senhas. Não cole a senha em chats, não a coloque no front-end e não a envie ao GitHub. Se gerar localmente e transferir pela ferramenta de arquivos do hPanel, ajuste `storage_dir` em `booking.php` para o caminho absoluto da pasta privada no servidor e confira as permissões. O exemplo de estrutura está em `server/booking.config.example.php`, sem credenciais reais.

4. O caminho padrão procurado é `imejr-private/booking.php`, ao lado de `public_html`. Confirme se o PHP da conta pode ler e gravar nessa pasta: a hospedagem aplica restrições de isolamento como `open_basedir`. Se o caminho estiver bloqueado, valide com o suporte um diretório privado permitido; não coloque a configuração dentro da área pública para contornar a restrição. Se sua estrutura for outra, defina a variável de ambiente `IMEJR_BOOKING_CONFIG` no servidor com o caminho absoluto. Configuração e armazenamento localizados dentro da raiz pública são rejeitados pelo código.
5. Não aplique cache de CDN/proxy aos caminhos `/api/`; os endpoints respondem com `Cache-Control: no-store, private`. Mantenha `environment` como `production` e `origins` apenas com os endereços HTTPS reais do site. Em `blocked_dates`, cadastre datas `YYYY-MM-DD` de recessos e feriados estaduais, municipais e móveis. Sábados, domingos e feriados nacionais de data fixa já são excluídos; o código não consulta um calendário oficial externo.
6. Gere `npm run build` e publique todo o conteúdo de `out/` em `public_html`, incluindo `api/` e o arquivo oculto `.htaccess`. **Não envie** `server/`, `scripts/`, `tests/`, `.booking-private/`, configurações ou backups ao diretório público. Garanta que PHP seja executado pelo servidor e que o arquivo privado pertença ao usuário PHP da sua conta.
7. Entre em `https://imejr.com/admin/`, publique um período curto e teste uma solicitação com seu próprio e-mail. Confira a caixa `contato@imejr.com`, a pasta de spam e os registros da hospedagem. Configure SPF/DKIM do domínio no serviço de e-mail. Este teste real precisa ser feito na sua conta: o teste local não envia e-mail.

## Segurança e operação

- Senhas são verificadas com `password_verify`; apenas hashes ficam na configuração privada. A senha gerada tem 128 bits aleatórios. Não existe senha padrão ou cadastro público de administrador.
- O acesso é compartilhado pela equipe. Para trocar a senha, gere um novo hash localmente com PHP (`password_hash`) e atualize apenas `admins['equipe']` na configuração privada. Ao alterar esse hash, as sessões anteriores deixam de funcionar. A senha não deve ser colocada no repositório.
- Cookies administrativos são `Secure` em produção, `HttpOnly`, `SameSite=Strict` e sem domínio compartilhado. Há regeneração de sessão no login, expiração após 20 minutos de inatividade e limite absoluto de 8 horas. Saia do painel ao terminar.
- Todas as alterações exigem autenticação no servidor e token CSRF. O login também usa CSRF. Origens não autorizadas são rejeitadas; não há CORS público. O servidor limita tentativas de login e envio por IP. Não se confia em cabeçalhos de IP encaminhados pelo cliente.
- O calendário no navegador é apenas interface: área, quantidade, datas e disponibilidade são verificados novamente no PHP. Há proteção contra repetição de solicitação e contra múltiplos envios simultâneos do mesmo pedido.
- Nomes, descrições e links são tratados como dados: escapados no HTML e exibidos como texto no painel. Apenas links HTTP/HTTPS são aceitos; o servidor não os visita nem recebe arquivos. Confirme a origem dos documentos antes de abri-los.
- O painel não é um mecanismo de privacidade por URL: a proteção é a sessão PHP. Não há segredos embutidos em JavaScript. O HTML do painel é público e contém somente a tela de acesso; a disponibilidade administrativa vem da API protegida; pedidos não são listados nem retornados pela API.
- Apenas identificadores aleatórios, fingerprints HMAC e estado técnico de envio são mantidos por até 24 horas (limpeza no próximo acesso), para evitar e-mails duplicados. Eles não contêm nome, e-mail, descrição ou links do formulário. Os contadores de limite também guardam identificadores HMAC e expiram; não é salvo o IP em claro. O campo `requests` da versão anterior é eliminado na próxima operação de armazenamento. Cópias antigas em backups não são apagadas pelo aplicativo.
- Faça backup da pasta privada fora da área pública, com acesso restrito. Monitore espaço em disco, falhas de e-mail e a caixa de entrada de contato. Não execute duas cópias com arquivos privados independentes esperando compartilhar a mesma disponibilidade.
- Não há MFA embutido. Para uma proteção adicional, use a proteção de diretório/controle de acesso da hospedagem no painel e mantenha PHP e a conta Hostinger atualizados. A restrição de URL não substitui autenticação.

## Testar localmente

`npm run dev` continua servindo o front-end, mas não executa PHP. Para testar o fluxo completo, pare outros processos que estejam escrevendo na pasta `out/` e use:

```bash
npm run build
php scripts/booking-init.php "$PWD/.booking-private" equipe --local
npm run booking:preview
```

O inicializador só precisa ser executado uma vez e nunca sobrescreve uma configuração existente. Abra `http://127.0.0.1:8080/admin/` com o usuário e a senha exibidos no seu terminal, publique os horários e depois abra `http://127.0.0.1:8080/agendamento/`.

O modo local só aceita conexões de loopback. Os e-mails ficam em `.booking-private/email-*.html`; **nenhum e-mail real é enviado**. O roteador local não executa `.htaccess`; HTTPS e os cabeçalhos de imagem devem ser conferidos na hospedagem após publicar. Nunca use `environment=development` em produção.

## Processo seletivo na mesma central

A aba **Processo Seletivo** usa a mesma conta compartilhada `equipe`, a mesma sessão, a mesma proteção CSRF e a mesma configuração privada. Não é necessário reinicializar nem recriar a senha. Os horários da agenda são preservados.

- Edite o título, a edição e as orientações de apresentação.
- Adicione links de cases, modelos e outros materiais. Apenas URLs HTTP/HTTPS válidas, sem credenciais na URL, são aceitas. O servidor não baixa os arquivos nem faz upload de documentos.
- Reordene, edite, oculte ou exclua materiais. A página começa oculta e exige ao menos um material visível para a publicação.
- Publique e compartilhe `/processo-seletivo/` com os candidatos. Essa página é de acesso público e não indexável; não coleta inscrições. Confira as permissões dos documentos externos. A publicação/ocultação no site não muda as permissões desses serviços.
- A API pública entrega apenas os materiais visíveis quando a página está publicada. Rascunhos ficam no armazenamento privado. As alterações usam controle de versão para evitar sobrescritas silenciosas entre sessões da equipe.

As duas áreas usam o mesmo backend PHP; publique também `api/admin.php`, `api/selection.php` e `api/_selection.php` junto aos endpoints já existentes. O estado editorial dos materiais é salvo no mesmo arquivo privado, no campo `selection`, sem alterar a agenda. O antigo campo de pedidos de reunião continua sendo removido; materiais do processo seletivo não são pedidos de reunião.

## Verificações automatizadas

```bash
npm run test:admin
npm run build
python3 tests/booking-http.py
```

O teste HTTP inicia seu próprio servidor PHP temporário em loopback, usa uma configuração descartável fora da área pública e captura os e-mails. Testa sessão, origem, CSRF, login, publicação da agenda, seleção, repetição, limites de envio e logout. Também verifica o acesso compartilhado, a edição dos materiais do processo seletivo e a exclusão de rascunhos da resposta pública. Não utiliza contas ou e-mails reais.
