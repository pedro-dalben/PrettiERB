# PrettiERB

![PrettiERB Logo](logo.png)

A comprehensive VS Code extension for formatting and indenting ERB (Embedded Ruby) files following Ruby programming best practices.

## Features

- ✅ **Automatic formatting** of ERB files
- ✅ **Intelligent indentation** for HTML and Ruby
- ✅ **Complete support** for ERB syntax
- ✅ **Customizable settings** (VS Code + .erbformatterrc)
- ✅ **Format on save** (optional)
- ✅ **Blank line preservation**
- ✅ **ERB comments support**
- ✅ **Rails helpers formatting** (form_with, link_to, etc.)
- ✅ **Performance optimized**
- ✅ **Code snippets** for common ERB patterns
- ✅ **Debug logging** for troubleshooting

## Installation

1. Open VS Code
2. Go to Extensions tab (Ctrl+Shift+X)
3. Search for "PrettiERB"
4. Click Install

## Usage

### Manual Formatting
- Use `Ctrl+Shift+P` and type "Format Document"
- Or use the command "PrettiERB: Format ERB Document"
- Or use the shortcut `Shift+Alt+F`

### Automatic Formatting
The extension can automatically format when saving the file (enabled by default).

## Configuration

You can customize the extension behavior through VS Code settings or a `.erbformatterrc` file:

### VS Code Settings

```json
{
  "erbFormatter.indentSize": 2,
  "erbFormatter.useTabs": false,
  "erbFormatter.formatOnSave": true,
  "erbFormatter.preserveBlankLines": true,
  "erbFormatter.logLevel": "none"
}
```

### .erbformatterrc File

Create a `.erbformatterrc` or `.erbformatterrc.json` file in your project root:

```json
{
  "indentSize": 2,
  "useTabs": false,
  "preserveBlankLines": true
}
```

### Configuration Options

- `erbFormatter.indentSize`: Number of spaces for indentation (default: 2)
- `erbFormatter.useTabs`: Use tabs instead of spaces (default: false)
- `erbFormatter.formatOnSave`: Automatically format on save (default: true)
- `erbFormatter.preserveBlankLines`: Preserve blank lines (default: true)
- `erbFormatter.logLevel`: Log level for debugging - "debug", "info", "warn", "error", "none" (default: "none")

## Examples

### Before formatting:
```erb
<div class="container">
<%if user.present?%>
<h1>Hello,<%=user.name%>!</h1>
<%users.each do |user|%>
<p><%=user.email%></p>
<%end%>
<%else%>
<p>User not found</p>
<%end%>
</div>
```

### After formatting:
```erb
<div class="container">
  <% if user.present? %>
    <h1>Hello, <%= user.name %>!</h1>
    <% users.each do |user| %>
      <p><%= user.email %></p>
    <% end %>
  <% else %>
    <p>User not found</p>
  <% end %>
</div>
```

## Supported Features

- **HTML Tags**: Automatic indentation based on structure
- **Ruby Blocks**: Recognition of `if`, `unless`, `case`, `for`, `while`, `def`, `class`, `module`, `begin`, `do`
- **Ruby Expressions**: Operator and spacing formatting
- **ERB Comments**: Support for `<%# comments %>`
- **ERB Output**: Formatting of `<%= expressions %>`
- **Rails Helpers**: Proper formatting of Rails view helpers with blocks
- **Method Chains**: Intelligent formatting of Ruby method chains
- **Complex Conditionals**: Nested if/else/case statements
- **Form Helpers**: Rails form_with, form_for, and other helpers
- **Inline ERB**: Smart detection of inline vs block ERB

## Code Snippets

Type the prefix and press Tab to insert:

- `erb-out` → `<%= %>`
- `erb-exp` → `<% %>`
- `erb-if` → `<% if %> ... <% end %>`
- `erb-each` → `<% each do |x| %> ... <% end %>`
- `erb-form` → `<%= form_with %> ... <% end %>`
- `erb-link` → `<%= link_to %>`
- And more...

## Advanced Features

### Rails Integration
- Automatic detection and formatting of Rails helpers
- Proper indentation for form builders
- Support for Rails-specific syntax patterns

### Performance
- Optimized for large files
- Efficient parsing and formatting algorithms
- Memory-conscious processing

### Error Handling
- Graceful handling of malformed ERB
- Fallback to original content on parsing errors
- Comprehensive error logging

## Development

To contribute to the project:

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile`
4. Press F5 to open a new VS Code window with the extension

### Testing

Run the test suite:
```bash
npm test
npm run test:unit
npm run coverage
```

### Linting

Check code quality:
```bash
npm run lint
```

## License

MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or pull request on GitHub.

## Author

Pedro Dalben - [GitHub Profile](https://github.com/pedro-dalben)
