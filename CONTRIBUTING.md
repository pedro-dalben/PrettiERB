# Guia de Contribuição

Obrigado pelo interesse em contribuir com o PrettiERB! 🎉

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor:

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/pedro-dalben/prettierb/issues)
2. Se não encontrou, crie uma nova issue incluindo:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Versão do VS Code e do PrettiERB
   - Exemplos de código ERB que causam o problema

### Sugerindo Melhorias

Sugestões de melhorias são bem-vindas! Crie uma issue descrevendo:

- O problema que a funcionalidade resolveria
- Como você imagina que funcionaria
- Exemplos de uso, se aplicável

### Pull Requests

1. **Fork o repositório**

2. **Clone seu fork**
```bash
git clone https://github.com/seu-usuario/prettierb
cd prettierb
```

3. **Instale as dependências**
```bash
npm install
```

4. **Crie uma branch para sua feature**
```bash
git checkout -b minha-feature
```

5. **Faça suas alterações**
   - Siga o estilo de código existente
   - Adicione testes para novas funcionalidades
   - Atualize a documentação se necessário

6. **Rode os testes**
```bash
npm run lint        # Verifica o código
npm run compile     # Compila TypeScript
npm run test:unit   # Roda testes unitários
npm test            # Roda todos os testes
```

7. **Commit suas mudanças**
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

Use conventional commits:
- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para documentação
- `test:` para testes
- `refactor:` para refatorações
- `style:` para formatação
- `chore:` para tarefas de manutenção

8. **Push para seu fork**
```bash
git push origin minha-feature
```

9. **Abra um Pull Request**
   - Descreva suas mudanças
   - Referencie issues relacionadas
   - Aguarde o review

## Estrutura do Projeto

```
erb_identer/
├── src/
│   ├── extension.ts           # Ponto de entrada
│   ├── formatter/
│   │   ├── erbFormatter.ts    # Orquestrador principal
│   │   ├── erbParser.ts       # Parser de tokens
│   │   ├── htmlFormatter.ts   # Formatador HTML
│   │   └── rubyFormatter.ts   # Formatador Ruby
│   ├── providers/
│   │   └── formattingProvider.ts
│   ├── utils/
│   │   ├── logger.ts          # Sistema de logging
│   │   └── configLoader.ts    # Carregador de config
│   └── test/                  # Testes
├── snippets/                  # Snippets de código
├── syntaxes/                  # Grammar para syntax highlighting
└── package.json
```

## Desenvolvimento

### Rodando em modo desenvolvimento

1. Abra o projeto no VS Code
2. Pressione `F5` para abrir uma nova janela com a extensão
3. Faça suas alterações
4. Recarregue a janela (Ctrl+R) para testar

### Testando

- **Testes unitários**: `npm run test:unit`
- **Testes de integração**: `npm test`
- **Coverage**: `npm run coverage`

### Debugging

Configure `erbFormatter.logLevel` para `"debug"` nas configurações do VS Code para ver logs detalhados.

## Código de Conduta

- Seja respeitoso com outros contribuidores
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros da comunidade

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT.

## Dúvidas?

Se tiver dúvidas, abra uma issue ou entre em contato!
