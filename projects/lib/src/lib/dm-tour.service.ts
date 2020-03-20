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

    constructor(
        private _rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document,
        @Inject('dmTourRootPath') @Optional() _cfg: DmTourConfig =  { rootPath: '/' }
    ) {
        this._r2 = this._rendererFactory.createRenderer(null, null);
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
        const ids: string[] = this._controls[sectionId] ? Object.keys(this._controls[sectionId]) : [];
        if (!ids || ids.length == 0) {
            console.warn(`[ngx-dm-tour] There are no controls registered for the section "${sectionId}"`);
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
                R.setAttribute(hl, 'stroke-width', '15');
                R.setAttribute(hl, 'stroke-opacity', '.3');
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
                R.setAttribute(hl, 'stroke-width', '15');
                R.setAttribute(hl, 'stroke-opacity', '.3');
                R.appendChild(mask, hl);
            }
        }
        if (count == 0) {
            console.warn(`[ngx-dm-tour] There are no controls registered for the section "${sectionId}"`);
            return;
        }
        R.appendChild(defs, mask);
        R.appendChild(svg, defs);

        const rect = R.createElement('rect', 'svg');
        R.setAttribute(rect, 'width', '10000');
        R.setAttribute(rect, 'height', '10000');
        R.setAttribute(rect, 'x', '0');
        R.setAttribute(rect, 'y', '0');
        R.setAttribute(rect, 'fill', 'black');
        R.setAttribute(rect, 'mask', 'url(#ngxDmTourControlsMask)');
        R.appendChild(svg, rect);
        R.setAttribute(svg, 'id', 'ngxDmTourBackdrop');
        R.setAttribute(svg, 'width', '10000px');
        R.setAttribute(svg, 'height', '10000px');
        const div = R.createElement('div');
        R.setStyle(div, 'position', 'fixed');
        R.setStyle(div, 'z-index', '9999');
        R.setStyle(div, 'top', '0');
        R.setStyle(div, 'right', '0');
        R.setStyle(div, 'bottom', '0');
        R.setStyle(div, 'left', '0');
        R.setStyle(div, 'overflow', 'hidden');
        R.setStyle(div, 'opacity', '0');
        R.setStyle(div, 'transition', 'opacity 1s');
        R.appendChild(div, svg);
        R.appendChild(this.document.body, div);
        setTimeout(() => R.setStyle(div, 'opacity', '.2'));
    }

    private _getBoundaries(el: any): DOMRect {
        if (!el || !el.getBoundingClientRect) {
            return null;
        }
        return el.getBoundingClientRect();
    }

}
