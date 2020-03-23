export function isElemVisible(elem: HTMLElement): boolean {
    if (!(!!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length))) {
        return false;
    }
    const { top, left, height, width } = elem.getBoundingClientRect();
    let el: any = elem.parentNode;
    do {
        const rect = el.getBoundingClientRect();
        if (rect.height > 0 && rect.width > 0) {
            if (
                (top <= rect.bottom === false)
                || ((top + height) <= rect.top)
                || (left <= rect.right === false)
                || ((left + width) <= rect.left)
            ) {
                return false;
            }
        }
        el = el.parentNode;
    } while (el != document.body);
    return top <= document.documentElement.clientHeight && left <= document.documentElement.clientWidth;
}
