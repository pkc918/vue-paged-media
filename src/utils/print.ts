export interface PrintPagedMediaOptions {
  pages: HTMLElement[];
  pageSize: {
    width: number;
    height: number;
  };
  title?: string;
}

export async function printPagedMedia(options: PrintPagedMediaOptions): Promise<void> {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  if (options.pages.length === 0) return;

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const frameWindow = frame.contentWindow;
  const frameDocument = frame.contentDocument;
  if (!frameWindow || !frameDocument) {
    frame.remove();
    return;
  }

  frameDocument.open();
  frameDocument.write(createPrintDocument(options));
  frameDocument.close();

  await waitForPrintDocument(frameDocument);

  const removeFrame = () => {
    frameWindow.removeEventListener("afterprint", removeFrame);
    frame.remove();
  };
  frameWindow.addEventListener("afterprint", removeFrame);

  frameWindow.focus();
  frameWindow.print();

  window.setTimeout(removeFrame, 60000);
}

function createPrintDocument({ pages, pageSize, title }: PrintPagedMediaOptions) {
  const printedPages = pages.map((page) => page.outerHTML).join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(title ?? document.title)}</title>
    ${collectDocumentStyles()}
    <style>
      @page {
        size: ${pageSize.width}mm ${pageSize.height}mm;
        margin: 0;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #fff;
      }

      .vue-paged-media__print-root {
        display: block;
      }

      .vue-paged-media__page {
        break-after: page;
        page-break-after: always;
        margin: 0;
      }

      .vue-paged-media__page:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      @media screen {
        body {
          background: #f4f4f5;
        }

        .vue-paged-media__page {
          margin: 0 auto;
        }
      }
    </style>
  </head>
  <body>
    <div class="vue-paged-media__print-root">${printedPages}</div>
  </body>
</html>`;
}

function collectDocumentStyles() {
  return Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        const rules = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
        return rules ? `<style>${rules}</style>` : "";
      } catch {
        if (styleSheet.href)
          return `<link rel="stylesheet" href="${escapeAttribute(styleSheet.href)}">`;
        return "";
      }
    })
    .join("\n");
}

async function waitForPrintDocument(frameDocument: Document) {
  await Promise.all([waitForFonts(frameDocument), waitForImages(Array.from(frameDocument.images))]);
}

async function waitForFonts(frameDocument: Document) {
  if (!("fonts" in frameDocument)) return;
  await frameDocument.fonts.ready;
}

async function waitForImages(images: HTMLImageElement[]) {
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
