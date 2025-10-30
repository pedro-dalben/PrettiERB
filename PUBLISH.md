# 🚀 Guia de Publicação Automática

## Script de Publicação Automatizada

Agora você pode publicar a extensão PrettiERB com apenas **um comando**!

### 📦 Como Usar

#### Opção 1: Via NPM (Recomendado)

```bash
# Incrementar versão patch (bugfixes)
npm run publish:patch    # 1.0.5 -> 1.0.6

# Incrementar versão minor (novas features)
npm run publish:minor    # 1.0.5 -> 1.1.0

# Incrementar versão major (breaking changes)
npm run publish:major    # 1.0.5 -> 2.0.0
```

#### Opção 2: Via Script Direto

```bash
./scripts/publish.sh patch
./scripts/publish.sh minor
./scripts/publish.sh major
```

### ⚙️ O Que O Script Faz Automaticamente

1. ✅ Atualiza a versão no `package.json`
2. ✅ Compila todo o TypeScript
3. ✅ Executa testes unitários
4. ✅ Cria o pacote VSIX
5. ✅ Faz commit das alterações
6. ✅ Publica no VS Code Marketplace
7. ✅ Envia para o repositório remoto (GitHub)

### 🔒 Requisitos

Antes de usar o script pela primeira vez:

1. **Instalar vsce globalmente:**
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Configurar credenciais do Azure DevOps:**
   ```bash
   vsce login pedro-dalben
   ```
   
   Você precisará criar um Personal Access Token em: https://dev.azure.com/

3. **Verificar conexão Git:**
   ```bash
   git remote -v
   ```

### 📝 Exemplo de Uso

```bash
# Publicar uma correção de bug
npm run publish:patch

# Você verá algo como:
# 📦 Versão atual: 1.0.5
# 🔢 Tipo de atualização: patch
# 📝 Atualizando versão...
# ✨ Nova versão: 1.0.6
# 🔨 Compilando TypeScript...
# 🧪 Executando testes...
# 📦 Criando pacote VSIX...
# 📤 Publicando no VS Code Marketplace...
# ✅ Publicação concluída com sucesso!
```

### 🎯 Tipos de Versão (Semantic Versioning)

- **PATCH** (1.0.5 → 1.0.6): Correções de bugs, pequenos ajustes
- **MINOR** (1.0.5 → 1.1.0): Novas funcionalidades, mantendo compatibilidade
- **MAJOR** (1.0.5 → 2.0.0): Mudanças que quebram compatibilidade

### 🔍 Verificação Pós-Publicação

Após publicar, você pode verificar:
- GitHub: Commits e tags criados
- Marketplace: https://marketplace.visualstudio.com/items?itemName=pedro-dalben.prettierb

### ⚠️ Troubleshooting

**Erro: vsce não encontrado**
```bash
npm install -g @vscode/vsce
```

**Erro: Falha na autenticação**
```bash
vsce logout
vsce login pedro-dalben
```

**Erro: Compilação falhou**
- Verifique se há erros de TypeScript: `npm run compile`
- Verifique se todas as dependências estão instaladas: `npm install`

**Erro: Testes falharam**
- O script continua mesmo com testes falhando (mas avisa)
- Para forçar parada, remova a linha `|| echo` no script

### 📚 Documentação Adicional

Para mais detalhes, consulte: [scripts/README.md](scripts/README.md)

---

✨ **Simples assim!** Agora você pode publicar atualizações com apenas um comando.

