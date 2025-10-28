# 🚀 GUIA COMPLETO: Como Publicar no VS Code Marketplace

## ✅ STATUS ATUAL
- ✅ Código enviado para GitHub: https://github.com/pedro-dalben/PrettiERB
- ✅ 10 commits organizados
- ✅ 182 testes passando (100%)
- ✅ Logos configurados
- ✅ Documentação completa

---

## 📋 PARTE 1: Preparar para Publicação

### Passo 1: Instalar o VSCE (Visual Studio Code Extensions)

```bash
# Instalar globalmente (recomendado)
npm install -g @vscode/vsce

# Verificar instalação
vsce --version
```

**Ou usar via npx** (sem instalar globalmente):
```bash
npx @vscode/vsce --version
```

---

## 🔑 PARTE 2: Criar Conta e Obter Token

### Passo 2: Criar Conta no Azure DevOps

1. Acesse: https://dev.azure.com/
2. Clique em **"Start free"** ou faça login
3. Use sua conta Microsoft/GitHub
4. Crie uma organização (pode usar qualquer nome)

### Passo 3: Criar Personal Access Token (PAT)

1. No Azure DevOps, clique no ícone de usuário (canto superior direito)
2. Selecione **"Personal Access Tokens"**
3. Clique em **"+ New Token"**
4. Configure:
   - **Name**: VS Code Marketplace
   - **Organization**: Selecione sua organização
   - **Expiration**: 90 days (ou mais, máximo 1 ano)
   - **Scopes**: Clique em **"Show all scopes"**
   - Marque **"Marketplace"** → **"Manage"** ✅
5. Clique em **"Create"**
6. **COPIE O TOKEN IMEDIATAMENTE** (só aparece uma vez!)
   - Salve em um lugar seguro (ex: gerenciador de senhas)

**Exemplo de token**:
```
ey...muito.longo...xyz123
```

---

## 🏪 PARTE 3: Criar Publisher no Marketplace

### Passo 4: Acessar Marketplace Management

1. Acesse: https://marketplace.visualstudio.com/manage
2. Faça login com a mesma conta do Azure DevOps
3. Clique em **"Create Publisher"** (se ainda não tem)
4. Preencha:
   - **ID**: `pedro-dalben` (já configurado no package.json ✓)
   - **Display Name**: Pedro Dalben
   - **Email**: seu email
   - **Description**: Desenvolvedor de extensões VS Code
5. Clique em **"Create"**

---

## 📦 PARTE 4: Empacotar e Publicar

### Passo 5: Fazer Login com o VSCE

```bash
# Entrar na pasta do projeto
cd /home/pedro/Documents/integrar/erb_identer

# Fazer login (você será solicitado a colar o PAT)
vsce login pedro-dalben
```

Quando solicitado, cole o Personal Access Token que você criou.

### Passo 6: Empacotar a Extensão (Teste Local)

```bash
# Criar arquivo .vsix
vsce package

# Isso gera: prettierb-1.0.0.vsix
```

### Passo 7: Testar Localmente (RECOMENDADO)

```bash
# Instalar a extensão localmente
code --install-extension prettierb-1.0.0.vsix

# Ou instalar via VS Code UI:
# 1. Abra VS Code
# 2. Extensions (Ctrl+Shift+X)
# 3. Clique nos "..." (três pontos)
# 4. Selecione "Install from VSIX..."
# 5. Escolha prettierb-1.0.0.vsix
```

**Teste a extensão:**
1. Abra um arquivo .erb
2. Use Ctrl+Shift+P → "PrettiERB: Format ERB Document"
3. Verifique se formata corretamente
4. Teste os snippets (digite `erb-if` + Tab)

### Passo 8: Publicar no Marketplace

```bash
# Publicar versão 1.0.0
vsce publish

# Ou especificar versão
vsce publish 1.0.0
```

**O que acontece:**
- ✅ Extensão é enviada para o Marketplace
- ✅ Passa por validação automática
- ✅ Fica disponível em ~5-10 minutos
- ✅ Aparece em buscas por "PrettiERB" ou "ERB formatter"

---

## 🔍 PARTE 5: Verificar Publicação

### Passo 9: Verificar no Marketplace

1. Acesse: https://marketplace.visualstudio.com/items?itemName=pedro-dalben.prettierb
2. Ou busque por "PrettiERB" em: https://marketplace.visualstudio.com/

### Passo 10: Instalar do Marketplace

```bash
# Via terminal
code --install-extension pedro-dalben.prettierb

# Ou via VS Code:
# 1. Extensions (Ctrl+Shift+X)
# 2. Busque "PrettiERB"
# 3. Clique em "Install"
```

---

## 🔄 PARTE 6: Atualizar a Extensão (Futuro)

### Quando quiser publicar uma nova versão:

```bash
# 1. Faça suas alterações no código
# 2. Atualize CHANGELOG.md
# 3. Commit e push para GitHub
git add .
git commit -m "feat: nova funcionalidade X"
git push

# 4. Atualize a versão automaticamente e publique
vsce publish patch   # 1.0.0 -> 1.0.1 (correções)
vsce publish minor   # 1.0.0 -> 1.1.0 (novas features)
vsce publish major   # 1.0.0 -> 2.0.0 (breaking changes)

# Ou atualize manualmente no package.json e depois:
vsce publish
```

---

## 📊 PARTE 7: Monitorar Estatísticas

### Acessar painel de analytics

1. Vá em: https://marketplace.visualstudio.com/manage/publishers/pedro-dalben
2. Veja estatísticas:
   - Downloads
   - Instalações ativas
   - Avaliações
   - Páginas vistas

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Ver o que será incluído no pacote
vsce ls

# Empacotar sem publicar
vsce package

# Publicar com mensagem de release
vsce publish -m "Release message here"

# Desautenticar
vsce logout pedro-dalben

# Listar extensões publicadas
vsce ls-publishers
```

---

## ⚠️ TROUBLESHOOTING

### Erro: "Missing publisher"
**Solução**: Verifique se `package.json` tem:
```json
"publisher": "pedro-dalben"
```

### Erro: "Missing README"
**Solução**: Certifique-se de que README.md existe e está commitado.

### Erro: "Extension is too large"
**Solução**: Marketplace tem limite de 50MB. Verifique:
```bash
du -sh .
```
Use `.vscodeignore` para excluir arquivos grandes.

### Erro: "Authentication failed"
**Solução**: 
1. Verifique se o PAT não expirou
2. Crie um novo PAT se necessário
3. Faça login novamente: `vsce login pedro-dalben`

### Extensão não aparece nas buscas
**Solução**: 
- Aguarde 10-15 minutos após publicação
- Verifique se foi aprovada em: https://marketplace.visualstudio.com/manage
- Certifique-se de que `keywords` estão bem configuradas no package.json

---

## 📝 CHECKLIST FINAL

Antes de publicar, verifique:

- [ ] `package.json` tem publisher correto
- [ ] Logo existe e está configurado (`icon: "logo.png"`)
- [ ] README.md está atualizado e completo
- [ ] CHANGELOG.md lista todas as mudanças
- [ ] Versão está correta
- [ ] Testes passam (npm test)
- [ ] Código está no GitHub
- [ ] .vscodeignore está configurado
- [ ] Personal Access Token está salvo
- [ ] Testou localmente antes de publicar

---

## 🎉 RESUMO DO PROCESSO

```
1. npm install -g @vscode/vsce          # Instalar ferramenta
2. Criar conta Azure DevOps             # https://dev.azure.com
3. Criar Personal Access Token          # Marketplace (Manage)
4. Criar Publisher                      # marketplace.visualstudio.com/manage
5. vsce login pedro-dalben              # Fazer login
6. vsce package                         # Testar empacotamento
7. code --install-extension *.vsix      # Testar localmente
8. vsce publish                         # PUBLICAR! 🚀
```

---

## 🔗 LINKS IMPORTANTES

- **Marketplace**: https://marketplace.visualstudio.com/
- **Manage**: https://marketplace.visualstudio.com/manage/publishers/pedro-dalben
- **Azure DevOps**: https://dev.azure.com/
- **GitHub**: https://github.com/pedro-dalben/PrettiERB
- **Documentação**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

---

## 🎊 APÓS A PUBLICAÇÃO

1. Compartilhe nas redes sociais
2. Adicione badge no README:
```markdown
[![VS Code Marketplace](https://img.shields.io/vscode-marketplace/v/pedro-dalben.prettierb.svg)](https://marketplace.visualstudio.com/items?itemName=pedro-dalben.prettierb)
```
3. Monitore feedback e issues no GitHub
4. Responda avaliações no Marketplace
5. Planeje próximas features

---

**Boa sorte com a publicação do PrettiERB! 🚀**
