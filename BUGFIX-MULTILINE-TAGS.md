# Correção: Tags HTML Multilinha

## Problema Identificado

Ao formatar arquivos ERB com tags HTML multilinha, o formatter estava:
- Separando atributos da tag de abertura
- Em alguns casos, movendo o atributo `class` para antes do nome da tag
- Gerando HTML inválido

### Exemplo do Bug

**Entrada:**
```html
<aside
  data-controller="sidebar"
  data-action="click@window->sidebar#outside"
  class="sidebar fixed top-0">
  <div>Content</div>
</aside>
```

**Saída Incorreta:**
```html
class="sidebar fixed top-0"
<aside
  data-controller="sidebar"
  data-action="click@window->sidebar#outside"
>
```

## Causa Raiz

1. **Parser linha-por-linha**: O `ErbParser` processava cada linha independentemente, não reconhecendo tags HTML que abrangiam múltiplas linhas
2. **Tokenização fragmentada**: Atributos eram tratados como tokens separados
3. **Regex inadequada**: A expressão regular para identificar tags de abertura não suportava quebras de linha

## Solução Implementada

### 1. ErbParser (`src/formatter/erbParser.ts`)

**Mudanças:**
- Adicionado sistema de `pendingHtmlTag` para acumular linhas de uma tag multilinha
- Implementado método `isHtmlTagComplete()` para detectar quando uma tag está completa
- Implementado método `startsHtmlTag()` para identificar início de tags HTML

**Lógica:**
```typescript
// Detecta início de tag multilinha
if (this.startsHtmlTag(trimmedLine) && !this.isHtmlTagComplete(line)) {
    pendingHtmlTag = {
        content: line,
        startLine: lineIndex + 1,
        startColumn: line.indexOf('<')
    };
    continue;
}

// Acumula linhas até a tag estar completa
if (pendingHtmlTag) {
    pendingHtmlTag.content += '\n' + line;

    if (this.isHtmlTagComplete(pendingHtmlTag.content)) {
        tokens.push({
            type: 'html',
            content: pendingHtmlTag.content.trim(),
            line: pendingHtmlTag.startLine,
            column: pendingHtmlTag.startColumn
        });
        pendingHtmlTag = null;
    }
}
```

### 2. HtmlFormatter (`src/formatter/htmlFormatter.ts`)

**Mudanças:**
- Método `formatOpeningTag()` adicionado para formatar tags multilinha
- Atualização da regex em `isOpeningTag()` para suportar newlines
- Correção do método `extractTagName()` para tags multilinha
- Indentação diferenciada: atributos recebem 2 espaços extras

**Regex Corrigida:**
```typescript
// Antes (não funcionava com newlines)
/^<[^\/!][^>]*>$/

// Depois (suporta newlines)
/^<[^\/!][\s\S]*>$/
```

**Formatação de Tags Multilinha:**
```typescript
private formatOpeningTag(tag: string, indentLevel: number, options: FormattingOptions): string {
    if (!tag.includes('\n')) {
        return `${indent}${tag}`;
    }

    const lines = tag.split('\n');
    const formattedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) { continue; }

        if (i === 0) {
            // Nome da tag: indentação base
            formattedLines.push(`${indent}${line}`);
        } else if (line === '>') {
            // Fechamento: mesma indentação da tag
            formattedLines.push(`${indent}${line}`);
        } else {
            // Atributos: indentação base + 2 espaços
            const attrIndent = this.getIndent(indentLevel, options) + '  ';
            formattedLines.push(`${attrIndent}${line}`);
        }
    }

    return formattedLines.join('\n');
}
```

## Resultado

### Entrada:
```html
<aside
  data-controller="sidebar"
  data-action="click@window->sidebar#outside"
  class="sidebar fixed top-0 left-0">
  <div class="header">
    <span>Content</span>
  </div>
</aside>
```

### Saída Correta:
```html
<aside
  data-controller="sidebar"
  data-action="click@window->sidebar#outside"
  class="sidebar fixed top-0 left-0">
  <div class="header">
    <span>Content</span>
  </div>
</aside>
```

## Invariantes Garantidas

1. **Nome da tag sempre primeiro**: Uma tag sempre começa com `<tagname`
2. **Atributos pertencem à tag**: Atributos só aparecem entre `<tagname` e `>`
3. **Indentação consistente**:
   - Nome da tag: indentação do nível atual
   - Atributos: indentação + 2 espaços
   - Fechamento `>`: indentação do nível atual
4. **HTML válido**: Nenhum atributo solto fora de tags

## Testes

- ✅ Todos os 113 testes unitários passando
- ✅ Tags de uma linha continuam funcionando
- ✅ Tags multilinha preservadas corretamente
- ✅ Indentação de elementos filhos correta
- ✅ Suporte a ERB dentro de atributos preservado

## Arquivos Modificados

1. `src/formatter/erbParser.ts` - Parser de tokens ERB
2. `src/formatter/htmlFormatter.ts` - Formatação de HTML
3. `test-examples/multiline-test.erb` - Exemplo de teste
