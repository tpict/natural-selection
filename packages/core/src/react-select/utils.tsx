// ==============================
// NO OP
// ==============================

export const noop = () => {};
export const emptyString = () => "";

// ==============================
// Scroll Helpers
// ==============================

export function isDocumentElement(el: HTMLElement): boolean {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}

// Normalized Scroll Top
// ------------------------------

export function normalizedHeight(el: HTMLElement): number {
  if (isDocumentElement(el)) {
    return window.innerHeight;
  }

  return el.clientHeight;
}

// Normalized scrollTo & scrollTop
// ------------------------------

export function getScrollTop(el: HTMLElement): number {
  if (isDocumentElement(el)) {
    return window.pageYOffset;
  }
  return el.scrollTop;
}

export function scrollTo(el: HTMLElement, top: number): void {
  // with a scroll distance, we perform scroll on the element
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }

  el.scrollTop = top;
}

// Get Scroll Parent
// ------------------------------

export function getScrollParent(element: HTMLElement): HTMLElement {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRx = /(auto|scroll)/;
  const docEl = document.documentElement;

  if (style.position === "fixed") return docEl;

  for (
    let parent: HTMLElement | null = element;
    (parent = parent.parentElement);

  ) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }

  return docEl;
}

// ==============================
// Get bounding client object
// ==============================

export type RectType = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  height: number;
  width: number;
};

// cannot get keys using array notation with DOMRect
export function getBoundingClientObj(element: HTMLElement): RectType {
  const rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
  };
}

// ==============================
// String to Key (kebabify)
// ==============================

export function toKey(str: string): string {
  return str.replace(/\W/g, "-");
}

// ==============================
// Touch Capability Detector
// ==============================

export function isTouchCapable(): boolean {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

// ==============================
// Mobile Device Detector
// ==============================

export function isMobileDevice(): boolean {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  } catch (e) {
    return false;
  }
}
