# 🚀 Guia de Publicação - PrettiERB

## 📋 Checklist Pré-Publicação

- [x] Projeto renomeado para PrettiERB
- [x] Logos adicionados e configurados
- [x] 182 testes passando (100%)
- [x] 0 warnings de linter
- [x] Documentação completa
- [ ] Repositório GitHub criado
- [ ] Código commitado no GitHub
- [ ] Extensão empacotada (.vsix)
- [ ] Testada localmente
- [ ] Publicada no Marketplace

## 🔧 Comandos Essenciais

### 1. Verificação Local
```bash
# Compilar
npm run compile

# Rodar linter
npm run lint

# Rodar todos os testes
npm test

# Rodar apenas testes unitários
npm run test:unit

# Gerar coverage
npm run coverage
```

### 2. Git Setup (se ainda não fez)
```bash
# Criar repositório no GitHub primeiro, depois:
git init
git add .
git commit -m "feat: initial release of PrettiERB v1.0.0"
git branch -M main
git remote add origin https://github.com/pedro-dalben/prettierb.git
git push -u origin main
```

### 3. Instalação do vsce
```bash
# Instalar globalmente
npm install -g @vscode/vsce

# Ou usar com npx (não precisa instalar)
npx @vscode/vsce --version
```

### 4. Empacotar a Extensão
```bash
# Criar arquivo .vsix
npx @vscode/vsce package

# Isso irá gerar: prettierb-1.0.0.vsix
```

### 5. Testar Localmente
```bash
# Instalar o .vsix no VS Code
code --install-extension prettierb-1.0.0.vsix

# Ou instalar via UI:
# 1. Abra VS Code
# 2. Extensions > ... > Install from VSIX
# 3. Selecione prettierb-1.0.0.vsix
```

### 6. Criar Conta no Marketplace
```bash
# 1. Acesse: https://marketplace.visualstudio.com/manage
# 2. Faça login com conta Microsoft/GitHub
# 3. Crie um Publisher se ainda não tem
#    Nome: pedro-dalben (já configurado no package.json)
```

### 7. Gerar Personal Access Token (PAT)
```bash
# 1. Acesse: https://dev.azure.com/
# 2. User Settings > Personal Access Tokens
# 3. New Token com escopo "Marketplace (Manage)"
# 4. Copie o token (só aparece uma vez!)
```

### 8. Fazer Login no vsce
```bash
# Fazer login com seu PAT
npx @vscode/vsce login pedro-dalben

# Cole o PAT quando solicitado
```

### 9. Publicar no Marketplace
```bash
# Publicar versão 1.0.0
npx @vscode/vsce publish

# Ou publicar e incrementar versão automaticamente
npx @vscode/vsce publish patch  # 1.0.0 -> 1.0.1
npx @vscode/vsce publish minor  # 1.0.0 -> 1.1.0
npx @vscode/vsce publish major  # 1.0.0 -> 2.0.0
```

### 10. Atualizações Futuras
```bash
# 1. Faça suas mudanças
# 2. Atualize CHANGELOG.md
# 3. Commit e push
git add .
git commit -m "feat: nova funcionalidade X"
git push

# 4. Atualize versão e publique
npm version patch  # ou minor/major
npx @vscode/vsce publish
```

## 📊 Verificações Importantes

### Antes de Empacotar
```bash
# Verificar se não há arquivos desnecessários
cat .vscodeignore

# Verificar tamanho do package
npx @vscode/vsce ls

# Ver preview do que será incluído
```

### Após Publicar
```bash
# Verificar status da publicação
# Acesse: https://marketplace.visualstudio.com/manage/publishers/pedro-dalben

# Instalar do marketplace
code --install-extension pedro-dalben.prettierb

# Ou buscar no VS Code:
# Extensions > Search: "PrettiERB"
```

## 🐛 Troubleshooting

### Erro: "Missing publisher"
```bash
# Certifique-se de que package.json tem:
"publisher": "pedro-dalben"
```

### Erro: "Missing icon"
```bash
# Verifique se logo.png existe na raiz
ls -la logo.png

# E se está configurado no package.json
grep "icon" package.json
```

### Erro: "Extension is too large"
```bash
# Marketplace tem limite de 50MB
# Verifique tamanho:
du -sh .

# Otimize se necessário:
# - Remova node_modules desnecessários
# - Use .vscodeignore para excluir mais arquivos
```

## 📝 Notas Importantes

1. **Versão**: Sempre incremente a versão no package.json antes de publicar
2. **CHANGELOG**: Mantenha atualizado para os usuários saberem o que mudou
3. **README**: É a primeira coisa que os usuários veem no Marketplace
4. **Keywords**: Ajudam na descoberta da extensão
5. **Icon**: Deve ser PNG, min 128x128 (nosso é 1024x1024 ✓)

## 🔗 Links Úteis

- **VS Code Marketplace**: https://marketplace.visualstudio.com/
- **Manage Publishers**: https://marketplace.visualstudio.com/manage
- **vsce Docs**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **Seu GitHub**: https://github.com/pedro-dalben/prettierb

## 🎯 Status Atual

✅ Projeto pronto para publicação
✅ 182/182 testes passando
✅ Documentação completa
✅ Logos configurados
🔜 Aguardando publicação no Marketplace

---

**Boa sorte com a publicação do PrettiERB! 🚀**
