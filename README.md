# Mantle Images

> [!CAUTION]
> **Status: Beta (v1.0.0)**  
> This plugin is currently in Alpha. Features and UI are subject to change.

Mantle Images brings professional image adjustments directly to the Obsidian page editor. It allows you to resize previews with aspect-ratio locking and perform destructive crops on local vault assets.

## Features
- **Smart Resizing**: Click any image preview to reveal thin resize markers. Scale images up to the document width while keeping the aspect ratio perfectly locked.
- **Destructive Cropping**: Traditional photo crop tools to modify your local assets. Any crop changes are applied directly to the file within your Obsidian vault.
- **Zenith Optimized**: Designed to match the aesthetics of the [Zenith theme](https://github.com/carnalMATRIX/obsidian-mantle-zenith), featuring sleek markers and smooth interactions.
- **Vault Security**: Only modifies images located within your vault; external assets remain untouched.

## Installation

### Manual Installation
1. Download the `main.js`, `manifest.json`, and `styles.css` from the latest release.
2. Create a folder named `mantle-images` in your vault's `.obsidian/plugins/` directory.
3. Move the downloaded files into that folder.
4. Restart Obsidian and enable **Mantle Images** in **Settings > Community plugins**.

## Development

To modify this plugin:
1. Navigate to this directory in your terminal.
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`
4. For active development, use: `npm run dev`

This plugin is built with TypeScript and esbuild.
