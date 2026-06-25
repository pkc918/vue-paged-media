const contentBlockAttribute = "data-vpm-content-block";

function paginateDocsDemos() {
  for (const root of document.querySelectorAll(".vue-paged-media")) {
    paginateDocsDemo(root);
  }
}

function paginateDocsDemo(root) {
  const source = root.querySelector(".vue-paged-media__source");
  const measurePage = root.querySelector(".vue-paged-media__measure-page");
  const pagesContainer = root.querySelector(".vue-paged-media__pages");
  const pageTemplate = root.querySelector(".vue-paged-media__page");

  if (!source || !measurePage || !pagesContainer || !pageTemplate) return;

  const pages = paginateSourceBlocks(source, measurePage);
  const pageStyle = pageTemplate.getAttribute("style") ?? "";
  const contentStyle = [
    `width:${measurePage.style.width}`,
    `height:${measurePage.style.height}`,
    "box-sizing:border-box",
    "overflow:hidden",
    "overflow-wrap:anywhere",
    "word-break:break-word",
  ].join(";");

  pagesContainer.replaceChildren(
    ...pages.map((page) => {
      const section = document.createElement("section");
      section.className = "vue-paged-media__page";
      section.setAttribute("style", pageStyle);

      const content = document.createElement("div");
      content.className = "vue-paged-media__page-content";
      content.setAttribute("style", contentStyle);
      content.innerHTML = page.join("");
      section.appendChild(content);

      return section;
    }),
  );
}

function paginateSourceBlocks(source, measurePage) {
  const nextPages = [];
  const blocks = getSourceBlocks(source);
  resetMeasurePage(measurePage);

  let currentPage = [];

  function commitPage() {
    nextPages.push(currentPage);
    currentPage = [];
    resetMeasurePage(measurePage);
  }

  for (const block of blocks) {
    let rest = block;

    while (rest) {
      const whole = rest.cloneNode(true);
      if (appendIfFits(measurePage, whole)) {
        currentPage.push(nodeToHtml(whole));
        rest = null;
        continue;
      }

      const split = splitNodeToFit(rest, measurePage);
      if (split.fit) {
        currentPage.push(nodeToHtml(split.fit));
      }

      if (currentPage.length > 0) {
        commitPage();
        rest = split.rest;
        continue;
      }

      const overflow = split.rest?.cloneNode(true) ?? rest.cloneNode(true);
      appendWithoutFitCheck(measurePage, overflow);
      currentPage.push(nodeToHtml(overflow));
      commitPage();
      rest = null;
    }
  }

  if (currentPage.length > 0 || nextPages.length === 0) {
    nextPages.push(currentPage);
  }

  return nextPages;
}

function getSourceBlocks(source) {
  return Array.from(source.querySelectorAll(`[${contentBlockAttribute}]`))
    .map((block) => getBlockNode(block))
    .filter((node) => node !== null);
}

function getBlockNode(block) {
  const meaningfulChildren = Array.from(block.childNodes).filter((node) => {
    return node.nodeType !== Node.TEXT_NODE || (node.textContent?.trim() ?? "") !== "";
  });
  if (meaningfulChildren.length === 1) return meaningfulChildren[0].cloneNode(true);
  if (meaningfulChildren.length === 0) return null;
  return block.cloneNode(true);
}

function resetMeasurePage(measurePage) {
  measurePage.replaceChildren();
}

function appendWithoutFitCheck(parent, node) {
  parent.appendChild(node);
}

function appendIfFits(measurePage, node) {
  measurePage.appendChild(node);
  if (pageHasRoom(measurePage)) return true;
  removeNode(node);
  return false;
}

function pageHasRoom(measurePage) {
  return measurePage.scrollHeight <= measurePage.clientHeight + 0.5;
}

function splitNodeToFit(node, measurePage) {
  return splitNodeIntoParent(node, measurePage, measurePage);
}

function splitNodeIntoParent(node, parent, measurePage) {
  if (node.nodeType === Node.TEXT_NODE) {
    return splitTextIntoParent(node, parent, measurePage);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    const clone = node.cloneNode(true);
    return appendIfFits(measurePage, clone)
      ? { fit: clone, rest: null }
      : { fit: null, rest: node.cloneNode(true) };
  }

  const fitElement = node.cloneNode(false);
  parent.appendChild(fitElement);
  if (!pageHasRoom(measurePage)) {
    removeNode(fitElement);
    return { fit: null, rest: node.cloneNode(true) };
  }

  const restElement = node.cloneNode(false);
  const children = Array.from(node.childNodes);
  let hasFitContent = false;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    const childClone = child.cloneNode(true);
    fitElement.appendChild(childClone);

    if (pageHasRoom(measurePage)) {
      hasFitContent = true;
      continue;
    }

    removeNode(childClone);
    const childSplit = splitNodeIntoParent(child, fitElement, measurePage);
    if (childSplit.fit) hasFitContent = true;
    if (childSplit.rest) restElement.appendChild(childSplit.rest);

    for (const remainingChild of children.slice(index + 1)) {
      restElement.appendChild(remainingChild.cloneNode(true));
    }
    break;
  }

  if (!hasFitContent) {
    removeNode(fitElement);
  }

  return {
    fit: hasFitContent ? fitElement : null,
    rest: restElement.childNodes.length > 0 ? restElement : null,
  };
}

function splitTextIntoParent(node, parent, measurePage) {
  const text = node.textContent ?? "";
  let low = 0;
  let high = text.length;
  let best = 0;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = document.createTextNode(text.slice(0, middle));
    parent.appendChild(candidate);

    if (pageHasRoom(measurePage)) {
      best = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
    removeNode(candidate);
  }

  const bestNode = best > 0 ? document.createTextNode(text.slice(0, best)) : null;
  if (bestNode && best < text.length) {
    bestNode.textContent = trimTrailingBreak(text.slice(0, best));
  }
  if (bestNode) parent.appendChild(bestNode);

  const restText = trimLeadingBreak(text.slice(best));
  return {
    fit: bestNode,
    rest: restText ? document.createTextNode(restText) : null,
  };
}

function trimTrailingBreak(value) {
  return value.replace(/\s+$/, "");
}

function trimLeadingBreak(value) {
  return value.replace(/^\s+/, "");
}

function removeNode(node) {
  node.parentNode?.removeChild(node);
}

function nodeToHtml(node) {
  const container = document.createElement("div");
  container.appendChild(node.cloneNode(true));
  return container.innerHTML;
}

let frame = null;

function schedulePagination() {
  if (frame !== null) {
    cancelAnimationFrame(frame);
  }
  frame = requestAnimationFrame(() => {
    frame = null;
    paginateDocsDemos();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", schedulePagination, { once: true });
} else {
  schedulePagination();
}

window.addEventListener("load", schedulePagination, { once: true });
void document.fonts?.ready.then(schedulePagination);
setTimeout(schedulePagination, 250);
