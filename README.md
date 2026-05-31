# Mantle Images

> [!NOTE]
> **Status: Beta (v1.0.0)**  
> Mantle Images is currently in public Beta. Feature updates concentrate on supporting additional image formats and improving cropping controls.

Mantle Images provides professional-grade image editing, resizing, and cropping tools directly within your Obsidian vault. It eliminates the need to use external image editors, allowing you to crop and format diagrams, photos, or screenshots directly inside your markdown notes.

---

## 🎨 Cohesive Styling

Mantle Images matches the design tokens of the **Project Mantle** core workspace. While it functions on any theme, it is optimized to merge with the **Zenith theme**, adopting its canvas modal window styling, glassmorphism panel backdrops, and hover sliders.

---

## ✨ Key Features

* **Visual Cropping Canvas:** Crop any vault image directly from a clean modal workspace.
* **Aspect Ratio Presets:** Lock cropping masks to specific shapes (1:1, 16:9, 4:3, or custom freeform dimensions).
* **Inline Resize Handles:** Resize images directly in your note editor using clean interactive handles.
* **Auto-Replacement:** Safely replaces the source file in your vault or saves the edited image as a new asset.

---

## 📥 Installation

### Method A: Via Obsidian Community Directory (Recommended once approved)
1. Go to **Settings** > **Community plugins** > **Browse**.
2. Search for **Mantle Images**.
3. Click **Install**, then click **Enable**.

### Method B: Via BRAT (Beta Reviewer's Auto-update Tester)
1. Install the **BRAT** plugin from Obsidian's community store.
2. In BRAT settings, click **Add Beta plugin** and enter:
   `https://github.com/carnalMATRIX/obsidian-mantle-images`
3. Click **Add Plugin** to download and auto-update.

### Method C: Manual Installation
1. Download `main.js`, `manifest.json`, and `styles.css` from the latest [GitHub Release](https://github.com/carnalMATRIX/obsidian-mantle-images/releases).
2. Inside your vault, navigate to `.obsidian/plugins/`.
3. Create a folder named `mantle-images` and paste the three downloaded files inside.
4. Restart Obsidian, go to **Settings** > **Community plugins**, and enable **Mantle Images**.

---

## 🔍 Troubleshooting

### Cannot edit or crop an image
* **Read-Only / Preview Mode:** Ensure the document is in edit mode. Some image actions require you to hover over or click the image while holding down modification hotkeys (e.g. `Alt` or `Ctrl`).
* **Unsupported Format:** Verify that the image is a standard format (PNG, JPG, WebP, GIF). SVG and PDF files cannot be cropped.

### Edited images are not saving
* **Vault Attachment Folders:** Ensure your vault's default folder for attachments is configured and exists in your vault settings under **Files and links** > **Default location for new attachments**.

---

## 🛠️ Development

If you wish to modify or customize this plugin locally:
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the compiler in watch mode:
   ```bash
   npm run dev
   ```
4. Build minified production code:
   ```bash
   npm run build
   ```

---

## 📄 License

Copyright (c) 2026 Ryan Bakker. Released under a **Personal Use License**. Non-commercial, personal use only. Redistribution or modification for distribution is strictly prohibited. See the `LICENSE` file for full terms.
