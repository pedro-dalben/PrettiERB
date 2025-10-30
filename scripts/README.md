# Scripts de Automação

## Script de Publicação

O script `publish.sh` automatiza todo o processo de publicação da extensão no VS Code Marketplace.

### Uso

#### Via NPM (Recomendado)

```bash
# Patch version (1.0.5 -> 1.0.6)
npm run publish:patch

# Minor version (1.0.5 -> 1.1.0)
npm run publish:minor

# Major version (1.0.5 -> 2.0.0)
npm run publish:major
```

#### Via Script Direto

```bash
./scripts/publish.sh patch   # Incrementa versão patch
./scripts/publish.sh minor   # Incrementa versão minor
./scripts/publish.sh major   # Incrementa versão major
```

### O que o script faz

1. **Atualiza a versão** no `package.json` (patch, minor ou major)
2. **Compila o TypeScript** para garantir que está tudo funcionando
3. **Executa testes** unitários
4. **Cria o pacote VSIX** para publicação
5. **Faz commit** das alterações de versão
6. **Publica no Marketplace** do VS Code
7. **Envia para o repositório** remoto (GitHub)

### Requisitos

- Node.js instalado
- `vsce` instalado (`npm install -g @vscode/vsce`)
- Credenciais do Azure DevOps configuradas para publicação
- Repositório Git configurado e conectado ao remoto

### Credenciais

Para publicar no Marketplace, você precisa ter um Personal Access Token do Azure DevOps.

1. Acesse: https://dev.azure.com/
2. User Settings > Personal Access Tokens
3. Crie um token com escopo "Marketplace (Manage)"
4. Configure: `vsce login <publisher-name>`

### Notas

- O script usa `npm version` para incrementar versões semanticamente
- Testes falhando não impedem a publicação (aviso será exibido)
- Todos os commits são feitos automaticamente com mensagens padronizadas
- O VSIX é criado mas NÃO deletado automaticamente (você pode deletar manualmente após validar)
