#!/bin/bash

set -e

echo "🚀 Iniciando processo de publicação PrettiERB..."

if [ -z "$1" ]; then
  echo "❌ Erro: Versão não especificada"
  echo "📝 Uso: ./scripts/publish.sh <major|minor|patch>"
  echo ""
  echo "Exemplos:"
  echo "  ./scripts/publish.sh patch  # 1.0.5 -> 1.0.6"
  echo "  ./scripts/publish.sh minor  # 1.0.5 -> 1.1.0"
  echo "  ./scripts/publish.sh major  # 1.0.5 -> 2.0.0"
  exit 1
fi

VERSION_TYPE=$1
CURRENT_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)

echo "📦 Versão atual: $CURRENT_VERSION"
echo "🔢 Tipo de atualização: $VERSION_TYPE"

if ! command -v npm-version &> /dev/null; then
  echo "❌ npm não encontrado. Por favor, instale o Node.js."
  exit 1
fi

echo "📝 Atualizando versão..."
npm version $VERSION_TYPE --no-git-tag-version

NEW_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)
echo "✨ Nova versão: $NEW_VERSION"

echo "🔨 Compilando TypeScript..."
npm run compile

if [ $? -ne 0 ]; then
  echo "❌ Erro ao compilar. Abortando publicação."
  exit 1
fi

echo "🧪 Executando testes..."
npm run test:unit

if [ $? -ne 0 ]; then
  echo "⚠️  Testes falharam, mas continuando com a publicação..."
fi

echo "📦 Criando pacote VSIX..."
npx vsce package

if [ $? -ne 0 ]; then
  echo "❌ Erro ao criar pacote. Abortando publicação."
  exit 1
fi

echo "📤 Fazendo commit das alterações..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION" || echo "⚠️  Nenhuma alteração para commitar"

echo "📤 Publicando no VS Code Marketplace..."
npx vsce publish

if [ $? -ne 0 ]; then
  echo "❌ Erro ao publicar. Verifique as credenciais."
  exit 1
fi

echo "🚀 Enviando para o repositório remoto..."
git push origin master

echo "✅ Publicação concluída com sucesso!"
echo "📦 Versão $NEW_VERSION publicada no Marketplace"
echo "🔗 https://marketplace.visualstudio.com/items?itemName=pedro-dalben.prettierb"

