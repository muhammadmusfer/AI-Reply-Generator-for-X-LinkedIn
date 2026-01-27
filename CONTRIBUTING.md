# Contributing to AI Reply Generator

First off, thank you for considering contributing to AI Reply Generator! It's people like you that make this extension better for everyone.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Specify your browser version and operating system**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, test it thoroughly on both LinkedIn and X
3. Ensure your code follows the existing style
4. Update the README.md if needed
5. Write a clear commit message describing your changes

## Development Setup

1. Clone your fork of the repository
2. Load the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project directory
3. Make your changes
4. Test on both LinkedIn and X platforms
5. Reload the extension to see your changes

## Code Style Guidelines

- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose
- Avoid hardcoding values - use constants instead
- Follow the existing code structure and patterns

## Project Structure

- `background/` - Service worker for background tasks
- `content-scripts/` - Scripts injected into web pages
- `popup/` - Extension popup interface
- `utils/` - Shared utility functions
- `assets/` - Icons and images

## Testing Checklist

Before submitting a PR, verify:

- [ ] Extension loads without errors
- [ ] Generate button appears on LinkedIn posts
- [ ] Generate button appears on X tweets
- [ ] API calls work with both OpenAI and Anthropic
- [ ] Settings save and load correctly
- [ ] UI is responsive and looks good
- [ ] No console errors or warnings
- [ ] Extension works on both light and dark themes

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing!
