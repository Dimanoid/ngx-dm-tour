import { Injectable, ElementRef, Inject, Optional, RendererFactory2, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { DmTourConfig, DmTourSection, DmTourControl } from './models';
import { isElemVisible } from './utils';

@Injectable({
    providedIn: 'root'
})
export class DmTourService {

    private _sections: { [id: string]: DmTourSection } = {};
    private _controls: { [sectionId: string]: { [id: string]: DmTourControl } } = {};

    private _r2: Renderer2;
    private _root: any;
    private _onClickRemove: () => void;
    private _onKeyupRemove: () => void;

    private _hlVisible: boolean = false;

    constructor(
        private _rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document,
        @Inject('dmTourRootPath') @Optional() private _cfg: DmTourConfig
    ) {
        if (!this._cfg) {
            this._cfg =  new DmTourConfig();
        }
        this._r2 = this._rendererFactory.createRenderer(null, null);
        console.log('config:', this._cfg);
    }

    registerControl(sectionId: string, id: string, el: ElementRef, position?: string, shape?: string) {
        if (!sectionId || !id || !el) {
            return;
        }
        if (!this._controls[sectionId]) {
            this._controls[sectionId] = {};
        }
        if (!this._controls[sectionId][id]) {
            this._controls[sectionId][id] = { id };
        }
        this._controls[sectionId][id].pos = position;
        this._controls[sectionId][id].el = el.nativeElement;
        this._controls[sectionId][id].shape = shape && shape == 'square' ? 'square' : 'circle';
    }

    unregisterControl(sectionId: string, id: string) {
        if (!this._controls[sectionId] || this._controls[sectionId][id]) {
            return;
        }
        delete this._controls[sectionId][id].el;
    }

    showControlsHelp(sectionId: string) {
        if (this._hlVisible) {
            return;
        }
        const ids: string[] = this._controls[sectionId] ? Object.keys(this._controls[sectionId]) : [];
        if (!ids || ids.length == 0) {
            console.warn(`[ngx-dm-tour] There are no visible controls registered for the section "${sectionId}"`);
            return;
        }
        const MR = Math.round;
        const R = this._r2;
        const bd = this.document.querySelector('ngxDmTourBackdrop');
        if (bd) {
            R.removeChild(this.document.body, bd);
        }
        const svg = R.createElement('svg', 'svg');
        const defs = R.createElement('defs', 'svg');

        let stop: any;

        const rgr = R.createElement('radialGradient', 'svg');
        R.setAttribute(rgr, 'id', 'ngxDmTourGradientR');
        stop = R.createElement('stop', 'svg');
        R.setAttribute(stop, 'offset', '90%');
        R.setAttribute(stop, 'stop-color', 'black');
        R.appendChild(rgr, stop);
        stop = R.createElement('stop', 'svg');
        R.setAttribute(stop, 'offset', '100%');
        R.setAttribute(stop, 'stop-color', 'transparent');
        R.appendChild(rgr, stop);
        R.appendChild(defs, rgr);

        const mask = R.createElement('mask', 'svg');
        R.setAttribute(mask, 'id', 'ngxDmTourControlsMask');
        const mrect = R.createElement('rect', 'svg');
        R.setAttribute(mrect, 'width', '10000');
        R.setAttribute(mrect, 'height', '10000');
        R.setAttribute(mrect, 'fill', 'white');
        R.appendChild(mask, mrect);

        let count = 0;
        for (const id of ids) {
            const c = this._controls[sectionId][id];
            if (!c || !c.el) {
                continue;
            }
            const el = typeof c.el === 'string' ? this.document.querySelector(c.el) : c.el;
            const b = this._getBoundaries(el);
            if (!isElemVisible(el) || !b || b.width == 0 || b.height == 0) {
                continue;
            }
            count++;
            if (c.shape == 'square') {
                const hl = R.createElement('rect', 'svg');
                R.setAttribute(hl, 'x', '' + MR(b.left - 10));
                R.setAttribute(hl, 'y', '' + MR(b.top - 10));
                R.setAttribute(hl, 'width', '' + MR(b.width + 20));
                R.setAttribute(hl, 'height', '' + MR(b.height + 20));
                R.setAttribute(hl, 'rx', '8');
                R.setAttribute(hl, 'fill', 'black');
                R.setAttribute(hl, 'stroke', 'black');
                R.setAttribute(hl, 'stroke-width', 'var(--ngx-dm-tour-hl-stroke-width, 15)');
                R.setAttribute(hl, 'stroke-opacity', 'var(--ngx-dm-tour-hl-stroke-opacity, .3)');
                R.appendChild(mask, hl);
            }
            else {
                const hl = R.createElement('circle', 'svg');
                const r = b.width > b.height ? b.width / 2 : b.height / 2;
                R.setAttribute(hl, 'cx', '' + MR(b.left + b.width / 2));
                R.setAttribute(hl, 'cy', '' + MR(b.top + b.height / 2));
                R.setAttribute(hl, 'r', '' + MR(r + 25));
                R.setAttribute(hl, 'fill', 'black');
                R.setAttribute(hl, 'stroke', 'black');
                R.setAttribute(hl, 'stroke-width', 'var(--ngx-dm-tour-hl-stroke-width, 15)');
                R.setAttribute(hl, 'stroke-opacity', 'var(--ngx-dm-tour-hl-stroke-opacity, .3)');
                R.appendChild(mask, hl);
            }
        }
        if (count == 0) {
            console.warn(`[ngx-dm-tour] There are no visible controls registered for the section "${sectionId}"`);
            return;
        }
        R.appendChild(defs, mask);
        R.appendChild(svg, defs);

        const rect = R.createElement('rect', 'svg');
        R.setAttribute(rect, 'width', '10000');
        R.setAttribute(rect, 'height', '10000');
        R.setAttribute(rect, 'x', '0');
        R.setAttribute(rect, 'y', '0');
        R.setAttribute(rect, 'fill', 'var(--ngx-dm-tour-backdrop-color, black)');
        R.setAttribute(rect, 'mask', 'url(#ngxDmTourControlsMask)');
        R.appendChild(svg, rect);
        R.setAttribute(svg, 'id', 'ngxDmTourBackdrop');
        R.setAttribute(svg, 'width', '10000px');
        R.setAttribute(svg, 'height', '10000px');
        this._root = R.createElement('div');
        R.setStyle(this._root, 'position', 'fixed');
        R.setStyle(this._root, 'z-index', '9999');
        R.setStyle(this._root, 'top', '0');
        R.setStyle(this._root, 'right', '0');
        R.setStyle(this._root, 'bottom', '0');
        R.setStyle(this._root, 'left', '0');
        R.setStyle(this._root, 'overflow', 'hidden');
        R.setStyle(this._root, 'opacity', '0');
        R.setStyle(this._root, 'transition', 'opacity 1s');
        R.appendChild(this._root, svg);
        this.document.activeElement.blur();
        this._hlVisible = true;
        R.appendChild(this.document.body, this._root);
        setTimeout(() => {
            R.setStyle(this._root, 'opacity', 'var(--ngx-dm-tour-backdrop-opacity, .3)');
            this._onClickRemove = R.listen(this.document, 'click', e => this.hideControlsHelp(e));
            this._onKeyupRemove = R.listen(this.document, 'keyup', e => this.hideControlsHelp(e));
        });
    }

    showHelp(sectionId: string) {
        if (this._hlVisible) {
            return;
        }
        const ids: string[] = this._controls[sectionId] ? Object.keys(this._controls[sectionId]) : [];
        if (!ids || ids.length == 0) {
            console.warn(`[ngx-dm-tour] There are no visible controls registered for the section "${sectionId}"`);
            return;
        }
        const MR = Math.round;
        const R = this._r2;
        const bd = this.document.querySelector('ngxDmTourBackdrop');
        if (bd) {
            R.removeChild(this.document.body, bd);
        }

        this._root = R.createElement('div');
        R.setStyle(this._root, 'position', 'fixed');
        R.setStyle(this._root, 'z-index', '9999');
        R.setStyle(this._root, 'top', '0');
        R.setStyle(this._root, 'right', '0');
        R.setStyle(this._root, 'bottom', '0');
        R.setStyle(this._root, 'left', '0');
        R.setStyle(this._root, 'overflow', 'hidden');
        R.setStyle(this._root, 'opacity', '0');
        R.setStyle(this._root, 'transition', 'opacity 1s');

        this.document.activeElement.blur();
        this._hlVisible = true;
        R.appendChild(this.document.body, this._root);
        setTimeout(() => {
            R.setStyle(this._root, 'opacity', 'var(--ngx-dm-tour-backdrop-opacity, .3)');
            this._onClickRemove = R.listen(this.document, 'click', e => this.hideControlsHelp(e));
            this._onKeyupRemove = R.listen(this.document, 'keyup', e => this.hideControlsHelp(e));
        });
    }

    hideControlsHelp(e?: Event) {
        this.hideHelp(e);
    }

    hideHelp(e?: Event) {
        if (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        if (this._onClickRemove) {
            this._onClickRemove();
            this._onClickRemove = null;
        }
        if (this._onKeyupRemove) {
            this._onKeyupRemove();
            this._onKeyupRemove = null;
        }
        if (this._root && this._r2) {
            this._r2.setStyle(this._root, 'transition', 'opacity .5s');
            this._r2.setStyle(this._root, 'opacity', '0');
            setTimeout(() => {
                this._r2.removeChild(this.document.body, this._root);
                this._hlVisible = false;
            }, 500);
        }
        else {
            this._hlVisible = false;
        }
    }

    private _getBoundaries(el: any): DOMRect {
        if (!el || !el.getBoundingClientRect) {
            return null;
        }
        return el.getBoundingClientRect();
    }

}
