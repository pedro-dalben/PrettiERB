# ERB Formatter Extension Installation and Development

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Visual Studio Code

## Development Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd erb-formatter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile TypeScript**
   ```bash
   npm run compile
   ```

4. **Test the extension**
   - Open the project in VS Code
   - Press `F5` to open a new window with the extension loaded
   - Open an `.erb` file in the new window
   - Test formatting with `Shift+Alt+F`

## Extension Installation

### Option 1: Local Packaging

1. **Install vsce (VS Code Extension Manager)**
   ```bash
   npm install -g vsce
   ```

2. **Package the extension**
   ```bash
   vsce package
   ```

3. **Install the generated .vsix file**
   - In VS Code, go to Extensions (Ctrl+Shift+X)
   - Click the three dots (...) at the top
   - Select "Install from VSIX..."
   - Choose the generated `.vsix` file

### Option 2: Continuous Development

For active development, use watch mode:

```bash
npm run watch
```

This will automatically recompile when you make changes to the code.

## Project Structure

```
erb-formatter/
├── src/                          # TypeScript source code
│   ├── extension.ts             # Extension entry point
│   ├── providers/               # Feature providers
│   │   └── formattingProvider.ts
│   ├── formatter/               # Formatting logic
│   │   ├── erbFormatter.ts      # Main formatter
│   │   ├── erbParser.ts         # ERB parser
│   │   ├── htmlFormatter.ts     # HTML formatter
│   │   └── rubyFormatter.ts     # Ruby formatter
│   └── test/                    # Test suite
│       ├── unit/                # Unit tests
│       └── suite/               # Integration tests
├── syntaxes/                    # Syntax definitions
│   └── erb.tmLanguage.json
├── test-examples/               # Test examples
├── out/                         # Compiled JavaScript
├── package.json                 # Extension configuration
├── language-configuration.json  # Language configuration
└── README.md                    # Documentation
```

## Testing the Extension

### Manual Testing

1. **Open example files**
   - `test-examples/example.erb`
   - `test-examples/complex-example.erb`
   - `test-examples/rails-forms.erb`
   - `test-examples/complex-conditionals.erb`

2. **Test formatting**
   - Use `Shift+Alt+F` to format the entire document
   - Select a section and use `Shift+Alt+F` to format only the selection
   - Save the file to test automatic formatting

3. **Test configurations**
   Add these settings to your `settings.json`:
   ```json
   {
     "erbFormatter.indentSize": 4,
     "erbFormatter.useTabs": true,
     "erbFormatter.formatOnSave": false,
     "erbFormatter.preserveBlankLines": false
   }
   ```

### Automated Testing

Run the complete test suite:

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run with coverage
npm run coverage

# Run linting
npm run lint
```

## Implemented Features

- ✅ Complete ERB document formatting
- ✅ Selection formatting
- ✅ Intelligent indentation for HTML and Ruby
- ✅ Ruby block recognition
- ✅ Ruby expression formatting
- ✅ ERB comment support
- ✅ Customizable settings
- ✅ Automatic formatting on save
- ✅ Syntax highlighting
- ✅ Auto-closing tags
- ✅ Rails helpers support
- ✅ Performance optimization
- ✅ Comprehensive error handling

## Contributing

1. Make your changes to the TypeScript code in `src/`
2. Run `npm run compile` to compile
3. Test using `F5` in VS Code
4. Add tests for new features
5. Run the test suite to ensure everything works
6. Document your changes in `CHANGELOG.md`

## Testing Guidelines

### Unit Tests
- Test individual components in isolation
- Cover edge cases and error conditions
- Ensure performance requirements are met

### Integration Tests
- Test the extension in VS Code environment
- Verify formatting commands work correctly
- Test configuration changes

### Performance Tests
- Ensure large files are handled efficiently
- Test memory usage with repeated operations
- Verify processing time limits

## Known Issues

- JavaScript/CSS embedded in ERB is not yet formatted
- Some complex nesting cases may need manual adjustment
- Very large files (>10MB) may experience slower performance

## Roadmap

- [ ] Support for JavaScript/CSS embedded formatting
- [ ] Better HTML vs Ruby context detection
- [ ] More granular configuration options
- [ ] VS Code Marketplace publication
- [ ] Additional Rails helpers support
- [ ] Custom formatting rules
- [ ] Plugin architecture for extensibility

## Debugging

### Enable Debug Logging
Add to your VS Code settings:
```json
{
  "erbFormatter.debug": true
}
```

### Common Issues
1. **Extension not activating**: Check the Output panel for error messages
2. **Formatting not working**: Ensure the file is recognized as ERB language
3. **Performance issues**: Check file size and complexity

## Publishing

To publish to VS Code Marketplace:

1. **Prepare for publishing**
   ```bash
   npm run vscode:prepublish
   ```

2. **Publish**
   ```bash
   vsce publish
   ```

## Support

For issues and feature requests, please use the GitHub repository issue tracker.
