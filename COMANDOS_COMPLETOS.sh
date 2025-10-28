#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 SCRIPT DE PUBLICAÇÃO - PrettiERB
# ═══════════════════════════════════════════════════════════════════════
#
# Este script contém todos os comandos necessários para publicar
# a extensão PrettiERB no VS Code Marketplace
#
# ⚠️  ATENÇÃO: Não execute este script diretamente!
# Copie e cole os comandos um por um, seguindo as instruções.
#
# ═══════════════════════════════════════════════════════════════════════

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║        🚀 PUBLICAÇÃO DO PrettiERB NO VS CODE MARKETPLACE         ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 1: PREPARAÇÃO
# ═══════════════════════════════════════════════════════════════════════

echo "📦 ETAPA 1: Instalando VSCE (Visual Studio Code Extensions)"
echo ""
echo "Execute:"
echo "  npm install -g @vscode/vsce"
echo ""
echo "Depois verifique:"
echo "  vsce --version"
echo ""
read -p "Pressione ENTER quando tiver instalado o vsce..."

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 2: CRIAR CONTA AZURE DEVOPS
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "🔑 ETAPA 2: Criar Conta no Azure DevOps"
echo ""
echo "1. Acesse: https://dev.azure.com/"
echo "2. Clique em 'Start free' ou faça login"
echo "3. Use sua conta Microsoft ou GitHub"
echo "4. Crie uma organização (qualquer nome)"
echo ""
read -p "Pressione ENTER quando tiver criado a conta..."

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 3: CRIAR PERSONAL ACCESS TOKEN
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "🔐 ETAPA 3: Criar Personal Access Token (PAT)"
echo ""
echo "1. No Azure DevOps, clique no ícone de usuário (canto superior direito)"
echo "2. Selecione 'Personal Access Tokens'"
echo "3. Clique em '+ New Token'"
echo "4. Configure:"
echo "   - Name: VS Code Marketplace"
echo "   - Organization: Selecione sua organização"
echo "   - Expiration: 90 days (ou mais)"
echo "   - Scopes: Clique em 'Show all scopes'"
echo "   - Marque 'Marketplace' → 'Manage' ✅"
echo "5. Clique em 'Create'"
echo "6. ⚠️  COPIE O TOKEN IMEDIATAMENTE (só aparece uma vez!)"
echo ""
echo "Salve o token em um lugar seguro!"
echo ""
read -p "Pressione ENTER quando tiver copiado o token..."

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 4: CRIAR PUBLISHER
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "🏪 ETAPA 4: Criar Publisher no Marketplace"
echo ""
echo "1. Acesse: https://marketplace.visualstudio.com/manage"
echo "2. Faça login com a mesma conta do Azure DevOps"
echo "3. Clique em 'Create Publisher'"
echo "4. Preencha:"
echo "   - ID: pedro-dalben (já configurado no package.json ✓)"
echo "   - Display Name: Pedro Dalben"
echo "   - Email: seu email"
echo "5. Clique em 'Create'"
echo ""
read -p "Pressione ENTER quando tiver criado o publisher..."

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 5: LOGIN NO VSCE
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "🔐 ETAPA 5: Fazer Login no VSCE"
echo ""
echo "Execute o comando abaixo e cole o Personal Access Token quando solicitado:"
echo ""
echo "  cd /home/pedro/Documents/integrar/erb_identer"
echo "  vsce login pedro-dalben"
echo ""
echo "Cole o PAT quando solicitado e pressione ENTER"
echo ""
read -p "Pressione ENTER quando tiver feito login..."

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 6: EMPACOTAR EXTENSÃO
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "📦 ETAPA 6: Empacotar a Extensão"
echo ""
echo "Execute:"
echo "  cd /home/pedro/Documents/integrar/erb_identer"
echo "  vsce package"
echo ""
echo "Isso criará: prettierb-1.0.0.vsix"
echo ""
read -p "Pressione ENTER quando tiver empacotado..."

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 7: TESTAR LOCALMENTE
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "🧪 ETAPA 7: Testar a Extensão Localmente (RECOMENDADO)"
echo ""
echo "Execute:"
echo "  code --install-extension prettierb-1.0.0.vsix"
echo ""
echo "Depois teste:"
echo "  1. Abra um arquivo .erb no VS Code"
echo "  2. Use Ctrl+Shift+P → 'PrettiERB: Format ERB Document'"
echo "  3. Verifique se formata corretamente"
echo "  4. Teste os snippets (digite 'erb-if' + Tab)"
echo ""
read -p "Pressione ENTER quando tiver testado..."

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 8: PUBLICAR
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "🚀 ETAPA 8: PUBLICAR NO MARKETPLACE!"
echo ""
echo "Execute:"
echo "  cd /home/pedro/Documents/integrar/erb_identer"
echo "  vsce publish"
echo ""
echo "⏳ Aguarde a publicação (pode levar 5-10 minutos)"
echo ""
read -p "Pressione ENTER quando tiver publicado..."

# ═══════════════════════════════════════════════════════════════════════
# ETAPA 9: VERIFICAR PUBLICAÇÃO
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "🔍 ETAPA 9: Verificar Publicação"
echo ""
echo "Acesse:"
echo "  https://marketplace.visualstudio.com/items?itemName=pedro-dalben.prettierb"
echo ""
echo "Ou busque 'PrettiERB' em:"
echo "  https://marketplace.visualstudio.com/"
echo ""
echo "Instale do marketplace:"
echo "  code --install-extension pedro-dalben.prettierb"
echo ""
read -p "Pressione ENTER para finalizar..."

# ═══════════════════════════════════════════════════════════════════════
# CONCLUSÃO
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║   🎉 PARABÉNS! PrettiERB FOI PUBLICADO COM SUCESSO!              ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Acesse as estatísticas em:"
echo "   https://marketplace.visualstudio.com/manage/publishers/pedro-dalben"
echo ""
echo "🌟 Próximos passos:"
echo "   • Compartilhe nas redes sociais"
echo "   • Monitore feedback no GitHub"
echo "   • Responda avaliações no Marketplace"
echo "   • Planeje próximas features"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo ""

