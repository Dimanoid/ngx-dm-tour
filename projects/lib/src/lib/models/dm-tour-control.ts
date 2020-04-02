export interface DmTourControl {
    id: string;
    children?: DmTourControl[];
    text?: string;
    el?: Element | string;
    shape?: 'circle' | 'square';
    pos?: 'auto'
        | 'top-left' | 'top' | 'top-right'
        | 'bottom-left' | 'bottom' | 'bottom-right'
        | 'left-top' | 'left' | 'left-bottom'
        | 'right-top' | 'right' | 'right-bottom';
}
