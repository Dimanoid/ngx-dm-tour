import { Injectable, ElementRef, Inject, Optional, RendererFactory2, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { DmTourConfig, DmTourSection, DmTourControl, DM_TOUR_CONF } from './models';
import { isElemVisible } from './utils';
import { Observable } from 'rxjs';
import { GLOBAL_STYLES } from './dm-tour.styles';

@Injectable({
    providedIn: 'root'
})
export class DmTourService {

    private _cfg: DmTourConfig;
    private _sections: { [id: string]: DmTourSection };
    private _controls: { [sectionId: string]: { [id: string]: DmTourControl } } = {};

    private _r2: Renderer2;
    private _root: any;
    private _onClickRemove: () => void;
    private _onKeyupRemove: () => void;

    private _hlVisible: boolean = false;

    constructor(
        private _rendererFactory: RendererFactory2,
        private _http: HttpClient,
        @Inject(DOCUMENT) private document,
        @Inject(DM_TOUR_CONF) @Optional() cfg: DmTourConfig
    ) {
        this._cfg =  new DmTourConfig(cfg);
        this._r2 = this._rendererFactory.createRenderer(null, null);
        console.log('config:', this._cfg);
        if (this._cfg.loadIndexOnStart) {
            this._addGlobalStyles();
            this._loadSections().subscribe(
                () => {},
                err => this._handleLoadError(err)
            );
        }
    }

    registerControl(sectionId: string, id: string, el: ElementRef) {
        if (!sectionId || !id || !el) {
            return;
        }
        if (!this._controls[sectionId]) {
            this._controls[sectionId] = {};
        }
        if (!this._controls[sectionId][id]) {
            this._controls[sectionId][id] = { id };
        }
        this._controls[sectionId][id].el = el.nativeElement;
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
        if (!this._sections) {
            this._addGlobalStyles();
            this._loadSections().subscribe(
                () => {
                    this._loadSectionControls(sectionId).subscribe(
                        () => this._showControlsHelp(sectionId),
                        err => this._handleLoadError(err)
                    );
                },
                err => this._handleLoadError(err)
            );
        }
        else if (!this._sections[sectionId]) {
            this._handleLoadError(`There is no a section "${sectionId}" defined.`);
        }
        else if (this._sections[sectionId] && !this._sections[sectionId].controlsLoaded) {
            this._loadSectionControls(sectionId).subscribe(
                () => this._showControlsHelp(sectionId),
                err => this._handleLoadError(err)
            );
        }
        else {
            this._showControlsHelp(sectionId);
        }
    }

    private _loadSections(): Observable<void> {
        this._showLoading();
        return new Observable(obs => {
            this._http.get<{ sections: DmTourSection[] }>(this._cfg.rootPath + '/index.json').subscribe(
                res => {
                    console.log('sections:', res);
                    this._hideLoading();
                    if (res && res.sections) {
                        this._sections = {};
                        for (const section of res.sections) {
                            this._sections[section.id] = section;
                        }
                        obs.next();
                    }
                    else {
                        obs.error('Wrong data format in ${this._cfg.rootPath}/index.json');
                    }
                },
                err => {
                    this._hideLoading();
                    obs.error(err);
                }
            );
        });
    }

    private _loadSectionControls(sectionId: string): Observable<void> {
        this._showLoading();
        return new Observable(obs => {
            this._http.get<{ controls: DmTourControl[] }>(`${this._cfg.rootPath}/${sectionId}/index.json`).subscribe(
                res => {
                    console.log('controls:', res);
                    this._hideLoading();
                    if (res && res.controls) {
                        for (const ctrl of res.controls) {
                            const c = this._controls[sectionId][ctrl.id];
                            this._controls[sectionId][ctrl.id] = ctrl;
                            this._controls[sectionId][ctrl.id].el = c ? c.el : null;
                        }
                        obs.next();
                    }
                    else {
                        obs.error('${this._cfg.rootPath}/${sectionId}/index.json');
                    }
                },
                err => {
                    this._hideLoading();
                    obs.error(err);
                }
            );
        });
    }

    private _showControlsHelp(sectionId: string) {
        const ids: string[] = this._controls[sectionId] ? Object.keys(this._controls[sectionId]) : [];
        if (!ids || ids.length == 0) {
            console.warn(`[ngx-dm-tour] There are no visible controls registered for the section "${sectionId}"`);
            return;
        }
        const MR = Math.round;
        const R = this._r2;
        const bd = this.document.querySelector('#ngxDmTourBackdrop');
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
            const shape = c.shape
                ? c.shape
                : this._cfg.defaultShape == 'auto'
                    ? (b.width > 200 || b.height > 200 ? 'square' : 'circle')
                    : this._cfg.defaultShape;
            if (shape == 'square') {
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
        R.setAttribute(svg, 'width', '10000px');
        R.setAttribute(svg, 'height', '10000px');
        const root = R.createElement('div');
        this._root = root;
        R.setAttribute(root, 'id', 'ngxDmTourBackdrop');
        R.appendChild(root, svg);
        this.document.activeElement.blur();
        this._hlVisible = true;
        R.appendChild(this.document.body, root);
        setTimeout(() => {
            R.setStyle(root, 'opacity', 'var(--ngx-dm-tour-backdrop-opacity, .3)');
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

        const root = R.createElement('div');
        this._root = root;
        R.setAttribute(root, 'id', 'ngxDmTourBackdrop');

        this.document.activeElement.blur();
        this._hlVisible = true;
        R.appendChild(this.document.body, root);
        setTimeout(() => {
            R.setStyle(root, 'opacity', 'var(--ngx-dm-tour-backdrop-opacity, .3)');
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
                this._r2.setStyle(this._root, 'transition', 'opacity 1s');
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

    private _showLoading() {
        const R = this._r2;
        const bd = this.document.querySelector('#ngxDmTourLoading');
        if (bd) {
            R.removeChild(this.document.body, bd);
        }

        const root = R.createElement('div');
        R.setAttribute(root, 'id', 'ngxDmTourLoading');
        root.innerHTML = this._cfg.loaderHtml;

        this.document.activeElement.blur();
        R.appendChild(this.document.body, root);
        setTimeout(() => R.setStyle(root, 'background-color', 'var(--ngx-dm-tour-loading-bg-color, rgba(0,0,0,.3))'));
    }

    private _hideLoading() {
        const R = this._r2;
        const bd = this.document.querySelector('#ngxDmTourLoading');
        if (bd) {
            R.removeChild(this.document.body, bd);
        }
    }

    private _handleLoadError(err: any) {
        console.warn('[ngx-dm-tour] load error:', err);
    }

    private _addGlobalStyles() {
        const R = this._r2;
        const bd = this.document.head.querySelector('#ngxDmTourStyles');
        if (bd) {
            R.removeChild(this.document.head, bd);
        }

        const root = R.createElement('style');
        R.setAttribute(root, 'id', 'ngxDmTourStyles');
        root.innerHTML = GLOBAL_STYLES;

        R.appendChild(this.document.head, root);
    }

}
