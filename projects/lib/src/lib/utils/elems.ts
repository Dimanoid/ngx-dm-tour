export function isElemVisible(el: HTMLElement): boolean {
    return !!el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}
