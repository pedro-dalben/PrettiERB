# Change Log - PrettiERB

## [1.0.4] - 2025-10-28

### Corrigido
- 🐛 **Correção de indentação de tags ERB multilinha**
  - Tags ERB (`<%= %>`) com código Ruby quebrado em múltiplas linhas agora preservam indentação correta
  - `link_to` e outros helpers Rails com argumentos em múltiplas linhas formatados corretamente
  - Blocos `else` e `elsif` mantêm indentação adequada para o conteúdo interno
  - Parser trata tags ERB multilinha como um único token
  - ERB malformado (sem `%>`) tratado graciosamente como HTML

### Exemplo
```erb
<% if condition? %>
  <%= link_to "Text", path,
      class: "very-long-class-name" %>
<% end %>
```

## [1.0.3] - 2025-10-28

### Corrigido
- 🐛 **Correção crítica de formatação de tags HTML multilinha**
  - Tags HTML que abrangem múltiplas linhas agora são preservadas corretamente
  - Atributos permanecem dentro das tags (não são mais separados ou movidos)
  - Corrigido bug onde `class` e outros atributos apareciam antes do nome da tag
  - Parser agora reconhece tags multilinha como um único token
  - Implementado `formatOpeningTag()` com indentação correta para atributos
  - Garantida geração de HTML válido em todos os casos
  - Regex atualizada para suportar tags com quebras de linha

### Documentação
- 📚 Adicionado documento técnico `BUGFIX-MULTILINE-TAGS.md` com detalhes da correção
- 📚 Adicionados exemplos de teste para tags multilinha

## [1.0.0] - 2024-10-28

### Adicionado
- ✨ Formatação completa de arquivos ERB com indentação inteligente
- ✨ Suporte para blocos Ruby (if, unless, case, for, while, def, class, module, begin, do)
- ✨ Formatação de expressões Ruby com espaçamento adequado de operadores
- ✨ Suporte para comentários ERB (<%# %>)
- ✨ Formatação de Rails helpers com blocos (form_with, link_to, etc.)
- ✨ Detecção inteligente de contexto inline vs block
- ✨ Configurações personalizáveis via VS Code settings
- ✨ Suporte para arquivo de configuração .erbformatterrc
- ✨ Formatação automática ao salvar (opcional)
- ✨ Preservação de linhas em branco
- ✨ Syntax highlighting para ERB
- ✨ Auto-fechamento de tags ERB
- ✨ Snippets de código para padrões comuns de ERB
- ✨ Sistema de logging configurável para debugging
- ✨ Documentação JSDoc completa no código
- ✨ 113 testes automatizados (100% passando)
- ✨ CI/CD com GitHub Actions
- ✨ Suporte para símbolos Ruby com formatação correta
- ✨ Formatação de hashes com sintaxe moderna (key: value)

### Corrigido
- 🐛 Correção de formatação de símbolos Ruby (`:symbol` mantém formato correto)
- 🐛 Correção de formatação de form helpers com blocos
- 🐛 Resolução de warnings de linter
- 🐛 Testes de integração com VS Code funcionando corretamente
