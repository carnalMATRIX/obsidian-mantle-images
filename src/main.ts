import { Plugin, TFile, MarkdownView, MarkdownPostProcessorContext, setIcon, Notice } from "obsidian";

export default class MantleImages extends Plugin {
  async onload() {
    console.log("Mantle Images: Loading plugin...");

    this.registerMarkdownPostProcessor((element: HTMLElement, context: MarkdownPostProcessorContext) => {
      const images = element.querySelectorAll("img");
      images.forEach((img) => {
        this.processImage(img, context);
      });
    });
  }

  private processImage(img: HTMLImageElement, context: MarkdownPostProcessorContext) {
    if (img.parentElement?.classList.contains("mantle-image-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("mantle-image-wrapper");
    img.parentNode?.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    img.onclick = (e) => {
      e.stopPropagation();
      this.showImageUI(wrapper, img, context);
    };
  }

  private showImageUI(wrapper: HTMLElement, img: HTMLImageElement, context: MarkdownPostProcessorContext) {
    // Remove existing UI elements
    wrapper.querySelectorAll(".mantle-image-ui").forEach(el => el.remove());

    // Create Resize Markers
    this.createResizeMarkers(wrapper, img);

    // Create Action Toolbar
    const toolbar = document.createElement("div");
    toolbar.classList.add("mantle-image-ui", "mantle-image-toolbar");
    
    const cropBtn = toolbar.createDiv({ cls: "mantle-image-action-btn" });
    setIcon(cropBtn, "crop");
    cropBtn.setAttribute("aria-label", "Crop Image");
    cropBtn.onclick = (e) => {
      e.stopPropagation();
      this.enterCropMode(wrapper, img, context);
    };

    wrapper.appendChild(toolbar);
  }

  private createResizeMarkers(wrapper: HTMLElement, img: HTMLImageElement) {
    const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];
    positions.forEach(pos => {
      const marker = document.createElement("div");
      marker.classList.add("mantle-image-ui", "mantle-image-resize-marker", pos);
      wrapper.appendChild(marker);

      marker.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleResize(e, wrapper, img, pos);
      };
    });
  }

  private handleResize(e: MouseEvent, wrapper: HTMLElement, img: HTMLImageElement, pos: string) {
    const startX = e.clientX;
    const startWidth = img.clientWidth;
    const startHeight = img.clientHeight;
    const aspectRatio = startWidth / startHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth;

      if (pos.includes("right")) {
        newWidth = startWidth + deltaX;
      } else if (pos.includes("left")) {
        newWidth = startWidth - deltaX;
      }

      // Constrain to document width
      const maxDocWidth = wrapper.parentElement?.clientWidth || window.innerWidth;
      if (newWidth > maxDocWidth) newWidth = maxDocWidth;
      if (newWidth < 50) newWidth = 50;

      const newHeight = newWidth / aspectRatio;
      img.style.width = `${newWidth}px`;
      img.style.height = `${newHeight}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      this.updateMarkdownLink(img);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  private async enterCropMode(wrapper: HTMLElement, img: HTMLImageElement, context: MarkdownPostProcessorContext) {
    // Check if it's a local vault file
    const file = this.getFileFromSource(img.src);
    if (!file) {
      new Notice("Mantle Images: Only local vault images can be cropped.");
      return;
    }

    wrapper.querySelectorAll(".mantle-image-ui").forEach(el => el.remove());

    const overlay = wrapper.createDiv("mantle-image-ui mantle-image-crop-overlay");
    const cropBox = wrapper.createDiv("mantle-image-ui mantle-image-crop-box");
    
    // Initialize crop box to full image size
    cropBox.style.width = "80%";
    cropBox.style.height = "80%";
    cropBox.style.top = "10%";
    cropBox.style.left = "10%";

    // Add crop specific markers (free aspect ratio)
    const positions = ["top-left", "top-right", "bottom-left", "bottom-right", "top", "bottom", "left", "right"];
    positions.forEach(pos => {
      const marker = cropBox.createDiv(`mantle-image-crop-marker ${pos}`);
      marker.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleCropResize(e, cropBox, wrapper, pos);
      };
    });

    const actionContainer = wrapper.createDiv("mantle-image-ui mantle-image-crop-actions");
    
    const applyBtn = actionContainer.createEl("button", { text: "Apply Crop", cls: "mod-cta" });
    applyBtn.onclick = async () => {
      await this.applyCrop(img, cropBox, file);
      this.exitCropMode(wrapper, img, context);
    };

    const cancelBtn = actionContainer.createEl("button", { text: "Cancel" });
    cancelBtn.onclick = () => this.exitCropMode(wrapper, img, context);
  }

  private handleCropResize(e: MouseEvent, cropBox: HTMLElement, wrapper: HTMLElement, pos: string) {
    const startX = e.clientX;
    const startY = e.clientY;
    const startRect = cropBox.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const onMouseMove = (moveEvent: MouseEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;

      let newLeft = startRect.left - wrapperRect.left;
      let newTop = startRect.top - wrapperRect.top;
      let newWidth = startRect.width;
      let newHeight = startRect.height;

      if (pos.includes("left")) {
        newLeft += deltaX;
        newWidth -= deltaX;
      }
      if (pos.includes("right")) {
        newWidth += deltaX;
      }
      if (pos.includes("top")) {
        newTop += deltaY;
        newHeight -= deltaY;
      }
      if (pos.includes("bottom")) {
        newHeight += deltaY;
      }

      // Constraints
      if (newWidth < 20) newWidth = 20;
      if (newHeight < 20) newHeight = 20;
      if (newLeft < 0) { newWidth += newLeft; newLeft = 0; }
      if (newTop < 0) { newHeight += newTop; newTop = 0; }
      if (newLeft + newWidth > wrapperRect.width) newWidth = wrapperRect.width - newLeft;
      if (newTop + newHeight > wrapperRect.height) newHeight = wrapperRect.height - newTop;

      cropBox.style.left = `${newLeft}px`;
      cropBox.style.top = `${newTop}px`;
      cropBox.style.width = `${newWidth}px`;
      cropBox.style.height = `${newHeight}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  private async applyCrop(img: HTMLImageElement, cropBox: HTMLElement, file: TFile) {
    const imgRect = img.getBoundingClientRect();
    const cropRect = cropBox.getBoundingClientRect();

    // Calculate relative coordinates
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const x = (cropRect.left - imgRect.left) * scaleX;
    const y = (cropRect.top - imgRect.top) * scaleY;
    const width = cropRect.width * scaleX;
    const height = cropRect.height * scaleY;

    // Use Canvas to crop
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;

    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    // Convert to Blob and save back to vault
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const arrayBuffer = await blob.arrayBuffer();
      await this.app.vault.modifyBinary(file, arrayBuffer);
      new Notice(`Mantle Images: Cropped ${file.name}`);
      
      // Update the image source to reflect changes (adding timestamp to avoid cache)
      img.src = this.app.vault.getResourcePath(file) + "?" + Date.now();
    }, "image/png");
  }

  private exitCropMode(wrapper: HTMLElement, img: HTMLImageElement, context: MarkdownPostProcessorContext) {
    wrapper.querySelectorAll(".mantle-image-ui").forEach(el => el.remove());
    this.showImageUI(wrapper, img, context);
  }

  private getFileFromSource(src: string): TFile | null {
    // 1. Try to resolve via Obsidian's internal resource path logic
    // src often looks like app://obsidian.rc/path/to/file.png?timestamp
    const pathMatch = src.match(/app:\/\/obsidian\.rc\/(.*?)(\?|$)/);
    if (pathMatch) {
      const decodedPath = decodeURIComponent(pathMatch[1]);
      const file = this.app.vault.getAbstractFileByPath(decodedPath);
      if (file instanceof TFile) return file;
    }

    // 2. Fallback: Try to match filename from the end of the URL
    const fileName = decodeURIComponent(src.split("?")[0].split("/").pop() || "");
    if (fileName) {
      const file = this.app.metadataCache.getFirstLinkpathDest(fileName, "");
      if (file) return file;
    }

    return null;
  }

  private updateMarkdownLink(img: HTMLImageElement) {
    // This is complex as it requires finding the original link in the active view
    // and updating it with the new width (e.g. ![[img.png|300]])
    console.log("Updating Markdown link for width:", img.style.width);
  }
}
