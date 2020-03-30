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

    showHelp(sectionId: string) {
        if (this._hlVisible) {
            return;
        }
        if (!this._sections) {
            this._addGlobalStyles();
            this._loadSections().subscribe(
                () => {
                    this._loadSectionHtml(sectionId).subscribe(
                        () => this._showHelp(sectionId),
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
            this._loadSectionHtml(sectionId).subscribe(
                () => this._showHelp(sectionId),
                err => this._handleLoadError(err)
            );
        }
        else {
            this._showHelp(sectionId);
        }
    }

    private _loadSections(): Observable<void> {
        this._showLoading();
        return new Observable(obs => {
            this._http.get<{ sections: DmTourSection[] }>(this._cfg.rootPath + '/index.json').subscribe(
                res => {
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
        if (!this._controls[sectionId]) {
            this._controls[sectionId] = {};
        }
        return new Observable(obs => {
            this._http.get<{ controls: DmTourControl[] }>(`${this._cfg.rootPath}/${sectionId}/index.json`).subscribe(
                res => {
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

    private _loadSectionHtml(sectionId: string): Observable<void> {
        this._showLoading();
        return new Observable(obs => {
            this._http.get(`${this._cfg.rootPath}/${sectionId}/index.html`, { responseType: 'text' }).subscribe(
                res => {
                    // console.log('section html:', res);
                    this._hideLoading();
                    this._sections[sectionId].html = res;
                    obs.next();
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
        const dr = this.document.body.getBoundingClientRect();
        const MR = Math.round;
        const R = this._r2;
        const bd = this.document.querySelector('#ngxDmTourRoot');
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

        const tts: any[] = [];
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

            const tt = R.createElement('div');
            R.addClass(tt, 'ngx-dm-tour-text');
            const tti = R.createElement('div');
            R.addClass(tti, 'ngx-dm-tour-text-inner');
            R.appendChild(tti, R.createText(c.text));
            R.appendChild(tt, tti);
            let pos = c.pos && c.pos != 'auto' ? c.pos.split('-') : null;
            if (!pos) {
                if (b.top > 250) {
                    pos = ['top', 'center'];
                }
                else if (dr.width - b.right > 250) {
                    pos = ['right', 'center'];
                }
                else if (dr.height - b.bottom > 250) {
                    pos = ['bottom', 'center'];
                }
                else if (b.left > 250) {
                    pos = ['left', 'center'];
                }
                else {
                    pos = ['center', 'center'];
                }
            }
            else if (pos.length == 1) {
                pos.push('center');
            }
            let x = MR(b.left + b.width / 2);
            let y = MR(b.top + b.height / 2);
            let tx = -50;
            let ty = -50;
            if (pos[0] == 'top') {
                ty = -100;
                y = b.top - 20;
                if (pos[1] == 'left') {
                    tx = 0;
                    x = b.left;
                }
                else if (pos[1] == 'right') {
                    tx = -100;
                    x = b.right;
                }
            }
            else if (pos[0] == 'bottom') {
                ty = 0;
                y = b.bottom + 20;
                if (pos[1] == 'left') {
                    tx = 0;
                    x = b.left;
                }
                else if (pos[1] == 'right') {
                    tx = -100;
                    x = b.right;
                }
            }
            else if (pos[0] == 'left') {
                tx = -100;
                x = b.left - 20;
                if (pos[1] == 'top') {
                    ty = 0;
                    y = b.top;
                }
                else if (pos[1] == 'bottom') {
                    ty = -100;
                    y = b.bottom;
                }
            }
            else if (pos[0] == 'right') {
                tx = 0;
                x = b.right + 20;
                if (pos[1] == 'top') {
                    ty = 0;
                    y = b.top;
                }
                else if (pos[1] == 'bottom') {
                    ty = -100;
                    y = b.bottom;
                }
            }
            // console.log(`[${c.id}] pos:`, pos, '\n\tb:', b, `-> ${x}x${y}`, '\n\tc:', c);
            R.setStyle(tt, 'top', `${y}px`);
            R.setStyle(tt, 'left', `${x}px`);
            R.setStyle(tt, 'transform', `translate(${tx}%, ${ty}%)`);
            R.addClass(tt, `ngx-dm-tour-text-${pos[0]}-${pos[1]}`);

            tts.push(tt);
        }
        if (tts.length == 0) {
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

        this._root = R.createElement('div');
        R.setAttribute(this._root, 'id', 'ngxDmTourRoot');
        if (this._cfg.customCssClass) {
            R.addClass(this._root, this._cfg.customCssClass);
        }
        const root = R.createElement('div');
        R.appendChild(this._root, root);
        R.setAttribute(root, 'id', 'ngxDmTourBackdrop');
        R.appendChild(root, svg);

        for (const tt of tts) {
            R.appendChild(this._root, tt);
        }

        this.document.activeElement.blur();
        this._hlVisible = true;
        R.appendChild(this.document.body, this._root);
        setTimeout(() => {
            R.addClass(this._root, 'ngx-dm-tour-show');
            this._onClickRemove = R.listen(this.document, 'click', e => this.hideControlsHelp(e));
            this._onKeyupRemove = R.listen(this.document, 'keyup', e => this.hideControlsHelp(e));
        });
    }

    private _showHelp(sectionId: string) {
        const sec = this._sections[sectionId];
        const ids: string[] = this._controls[sectionId] ? Object.keys(this._controls[sectionId]) : [];
        const MR = Math.round;
        const R = this._r2;
        const obd = this.document.querySelector('ngxDmTourRoot');
        if (obd) {
            R.removeChild(this.document.body, obd);
        }

        this._root = R.createElement('div');
        R.setAttribute(this._root, 'id', 'ngxDmTourRoot');
        if (this._cfg.customCssClass) {
            R.addClass(this._root, this._cfg.customCssClass);
        }
        const root = R.createElement('div');
        R.appendChild(this._root, root);
        R.setAttribute(root, 'id', 'ngxDmTourBackdrop');
        R.addClass(root, 'ngx-dm-tour-dialog');

        const dc = R.createElement('div');
        R.appendChild(this._root, dc);
        R.setAttribute(dc, 'id', 'ngxDmTourDialogContainer');
        const d = R.createElement('div');
        R.appendChild(dc, d);
        R.setAttribute(d, 'id', 'ngxDmTourDialog');
        R.addClass(d, `ngx-dm-tour-section-${sec.id}`);

        const btnClose = R.createElement('button');
        R.appendChild(d, btnClose);
        R.setAttribute(btnClose, 'id', 'ngxDmTourDialogBtnClose');
        R.addClass(btnClose, 'ngx-dm-tour-button');
        const btnControls = R.createElement('button');
        R.appendChild(d, btnControls);
        R.setAttribute(btnControls, 'id', 'ngxDmTourDialogBtnControls');
        R.addClass(btnControls, 'ngx-dm-tour-button');
        R.listen(btnControls, 'click', e => this.hideHelp(e, () => this.showControlsHelp(sectionId)));

        const dt = R.createElement('div');
        R.appendChild(d, dt);
        R.setAttribute(dt, 'id', 'ngxDmTourDialogTitle');
        R.appendChild(dt, R.createText(`Section "${sec.title}"`));

        const dd = R.createElement('div');
        R.appendChild(d, dd);
        R.setAttribute(dd, 'id', 'ngxDmTourDialogDesc');
        const ddi = R.createElement('div');
        R.appendChild(dd, ddi);
        R.setAttribute(ddi, 'id', 'ngxDmTourDialogDescInner');
        ddi.innerHTML = sec.html;

        // const df = R.createElement('div');
        // R.appendChild(d, df);
        // R.setAttribute(df, 'id', 'ngxDmTourDialogFooter');
        // const btnIndex = R.createElement('button');
        // R.appendChild(df, btnIndex);
        // R.setAttribute(btnIndex, 'id', 'ngxDmTourDialogBtnIndex');
        // R.addClass(btnIndex, 'ngx-dm-tour-button');
        // R.listen(btnIndex, 'click', e => {
        //     e.stopImmediatePropagation();
        // });

        this.document.activeElement.blur();
        this._hlVisible = true;
        R.appendChild(this.document.body, this._root);
        // console.log('_root', this._root);
        setTimeout(() => {
            R.addClass(this._root, 'ngx-dm-tour-show');
            this._onClickRemove = R.listen(this.document, 'click', e => this.hideControlsHelp(e));
            this._onKeyupRemove = R.listen(this.document, 'keyup', e => this.hideControlsHelp(e));
        });
    }

    hideControlsHelp(e?: Event) {
        this.hideHelp(e);
    }

    hideHelp(e?: Event, cb?: () => void) {
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
            // this._r2.setStyle(this._root, 'transition', 'opacity .5s');
            // this._r2.setStyle(this._root, 'opacity', '0');
            this._r2.removeClass(this._root, 'ngx-dm-tour-show');
            setTimeout(() => {
                this._r2.removeChild(this.document.body, this._root);
                this._hlVisible = false;
                if (cb) {
                    cb();
                }
            }, 500);
        }
        else {
            this._hlVisible = false;
            if (cb) {
                cb();
            }
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
        const obd = this.document.querySelector('#ngxDmTourLoading');
        if (obd) {
            R.removeChild(this.document.body, obd);
        }

        const root = R.createElement('div');
        R.setAttribute(root, 'id', 'ngxDmTourLoading');
        if (this._cfg.customCssClass) {
            R.addClass(root, this._cfg.customCssClass);
        }
        root.innerHTML = this._cfg.loaderHtml;

        this.document.activeElement.blur();
        R.appendChild(this.document.body, root);
        setTimeout(() => R.setStyle(root, 'background-color', 'var(--ngx-dm-tour-loading-bg-color, rgba(0,0,0,.3))'));
    }

    private _hideLoading() {
        const R = this._r2;
        const obd = this.document.querySelector('#ngxDmTourLoading');
        if (obd) {
            R.removeChild(this.document.body, obd);
        }
    }

    private _handleLoadError(err: any) {
        console.warn('[ngx-dm-tour] load error:', err);
    }

    private _addGlobalStyles() {
        const R = this._r2;
        const obd = this.document.head.querySelector('#ngxDmTourStyles');
        if (obd) {
            R.removeChild(this.document.head, obd);
        }

        const root = R.createElement('style');
        R.setAttribute(root, 'id', 'ngxDmTourStyles');
        root.innerHTML = GLOBAL_STYLES;

        R.appendChild(this.document.head, root);
    }

}
