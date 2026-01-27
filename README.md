# AI Reply Generator for X & LinkedIn

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Chrome Extension](https://img.shields.io/badge/chrome-extension-blue.svg)
![Manifest V3](https://img.shields.io/badge/manifest-v3-green.svg)

A powerful Chrome extension that leverages AI to generate contextual, high-quality replies for X (Twitter) and LinkedIn posts. Supports both OpenAI (GPT-4o) and Anthropic Claude for intelligent response generation.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [How to Use](#how-to-use)
- [Troubleshooting](#troubleshooting)
- [Privacy & Security](#privacy--security)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Contextual Replies**: Analyzes the post content and author to generate relevant responses
- **Customizable Tones**: Choose from Professional, Casual, Enthusiastic, Thoughtful, or Supportive
- **Personal Context**: Add your own bio/context to make replies sound more like you
- **Multi-Provider Support**: Use OpenAI GPT-4o or Anthropic Claude
- **Platform Native**: Injects "✨ Generate Reply" buttons directly into LinkedIn and X interfaces
- **Privacy Focused**: API keys are stored locally in your browser's sync storage
- **Customizable Length**: Short, Medium, or Long replies
- **Emoji Support**: Optional emoji inclusion in generated replies

## Demo

> **Note**: Add screenshots or a demo GIF here to showcase your extension in action.

### Example Usage

1. Browse LinkedIn or X
2. Click on any post to reply
3. Click the "✨ Generate Reply" button
4. Review and insert the AI-generated response

## Tech Stack

- **Manifest Version**: Chrome Extension Manifest V3
- **APIs**: OpenAI GPT-4o, Anthropic Claude
- **Languages**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: Chrome Storage API (sync)
- **Architecture**: Service Worker + Content Scripts

## Project Structure

```
chrome-extension-reply-generator/
├── assets/                    # Extension icons and images
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── background/                # Background service worker
│   └── service-worker.js
├── content-scripts/          # Content scripts for platform integration
│   ├── dom-utils.js          # DOM manipulation utilities
│   ├── injected.css          # Injected UI styles
│   ├── linkedin-content.js   # LinkedIn-specific integration
│   ├── ui-injector.js        # UI injection logic
│   └── x-content.js          # X (Twitter) integration
├── popup/                    # Extension popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── utils/                    # Shared utilities
│   ├── api-client.js         # API client for OpenAI/Anthropic
│   ├── constants.js          # App constants
│   ├── prompt-builder.js     # AI prompt construction
│   └── storage-manager.js    # Chrome storage wrapper
├── manifest.json             # Extension manifest
├── LICENSE                   # MIT License
└── README.md                 # This file
```

## Installation

### For Developers (Load Unpacked)

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"** and select the `chrome-extension-reply-generator` folder.
5. The extension icon should now appear in your toolbar.

## Configuration

1. Click the extension icon in your toolbar to open the settings.
2. **Select Provider**: Choose between OpenAI (default) or Anthropic Claude.
3. **API Key**: Enter your API key.
   - [Get OpenAI API Key](https://platform.openai.com/api-keys)
   - [Get Anthropic API Key](https://console.anthropic.com/settings/keys)
4. **Set Preferences**: Choose your preferred tone, length, and whether to include emojis.
5. **Personal Context**: (Optional) Add a brief description of yourself to help the AI tailor its responses.
6. **Save**: Click "Save Settings".

## How to Use

### LinkedIn
1. Navigate to LinkedIn.
2. Find a post you want to reply to.
3. Click the "Comment" button on the post.
4. You will see a **"✨ Generate Reply"** button near the comment box.
5. Click it and wait for the AI to generate a response.
6. A preview modal will appear (unless "Auto-insert" is enabled). Review, edit, and click **"Insert Reply"**.

### X (Twitter)
1. Navigate to X.com.
2. Click the reply icon on any tweet.
3. You will see a **"✨ Generate Reply"** button in the reply toolbar.
4. Click it to generate your response.

## Troubleshooting

- **Button not appearing**: Try refreshing the page. Some dynamic content might take a moment to load.
- **API Error**: Ensure your API key is correct and you have sufficient credits in your account.
- **Extraction failed**: The platform's DOM might have changed. Please report an issue if this persists.

## Privacy & Security

- Your API keys are stored using `chrome.storage.sync` and are never sent to any server other than the AI provider you select.
- The extension only reads the content of the post you are currently interacting with when you click the "Generate Reply" button.
- No data is collected or tracked.
- All communication happens directly between your browser and the AI provider (OpenAI or Anthropic).

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and structure
- Test your changes on both LinkedIn and X platforms
- Update documentation as needed
- Ensure no sensitive data is committed (API keys, personal info)

### Bug Reports

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser version and OS

## Roadmap

- [ ] Support for more social platforms (Reddit, Facebook, etc.)
- [ ] Multiple AI models selection (GPT-3.5, Claude Haiku, etc.)
- [ ] Reply templates and saved prompts
- [ ] Reply history and favorites
- [ ] Keyboard shortcuts
- [ ] Dark mode support

## Support

If you find this project helpful, please consider:
- Giving it a ⭐ on GitHub
- Sharing it with others
- Contributing to its development
- Reporting bugs and suggesting features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Jaineel](https://github.com/jaineel)

---

**Disclaimer**: This extension requires API keys from OpenAI or Anthropic. API usage may incur costs based on your provider's pricing. Please review their pricing before use.
