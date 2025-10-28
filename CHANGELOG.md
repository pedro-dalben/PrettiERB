# Change Log - PrettiERB

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
