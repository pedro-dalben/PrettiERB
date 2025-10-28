# 🚀 COMECE AQUI - Publicação Rápida do PrettiERB

## ✅ Situação Atual

- ✅ Código no GitHub: https://github.com/pedro-dalben/PrettiERB
- ✅ 12 commits organizados
- ✅ 182 testes passando (100%)
- ✅ Qualidade impecável

## 🎯 Publicar AGORA - 8 Passos Simples

```bash
# PASSO 1: Instalar ferramenta
npm install -g @vscode/vsce

# PASSO 2: Acessar e criar conta
# Abra no navegador: https://dev.azure.com/
# Faça login e crie uma organização

# PASSO 3: Criar Personal Access Token
# Azure DevOps → User Icon → Personal Access Tokens → + New Token
# Name: VS Code Marketplace
# Scopes: Marketplace → Manage ✅
# Copie o token!

# PASSO 4: Criar Publisher
# Abra: https://marketplace.visualstudio.com/manage
# Create Publisher → ID: pedro-dalben

# PASSO 5: Fazer login (cole o token quando solicitado)
cd /home/pedro/Documents/integrar/erb_identer
vsce login pedro-dalben

# PASSO 6: Empacotar
vsce package

# PASSO 7: Testar localmente (IMPORTANTE!)
code --install-extension prettierb-1.0.0.vsix
# Teste formatando um arquivo .erb

# PASSO 8: PUBLICAR! 🚀
vsce publish
```

## 📚 Precisa de mais detalhes?

- **Guia completo**: `cat GUIA_MARKETPLACE.md`
- **Script interativo**: `bash COMANDOS_COMPLETOS.sh`
- **Comandos rápidos**: `cat COMANDOS_PUBLICACAO.md`

## 🆘 Problemas?

Veja a seção de Troubleshooting no `GUIA_MARKETPLACE.md`

## 🎊 Depois de Publicar

1. Acesse: https://marketplace.visualstudio.com/items?itemName=pedro-dalben.prettierb
2. Compartilhe nas redes sociais
3. Monitore: https://marketplace.visualstudio.com/manage/publishers/pedro-dalben

**Boa sorte! O PrettiERB está pronto! 🚀**
