import { Injectable, ElementRef, Inject, Optional } from '@angular/core';
import { Subject } from 'rxjs';

import { DmTourConfig, DmTourSection, DmTourControl } from './models';

@Injectable({
    providedIn: 'root'
})
export class DmTourService {

    private _sections: { [id: string]: DmTourSection } = {};
    private _controls: { [id: string]: { [id: string]: DmTourControl } } = {};
    private _rect: DOMRect;

    constructor(
        @Inject('dmTourRootPath') @Optional() _cfg: DmTourConfig =  { rootPath: '/' }
    ) { }

    registerControl(sectionId: string, id: string, el: ElementRef, position?: string) {
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
    }

    unregisterControl(sectionId: string, id: string) {
        if (!this._controls[sectionId] || this._controls[sectionId][id]) {
            return;
        }
        delete this._controls[sectionId][id].el;
    }

    // private _checkElement() {
    //     const r: DOMRect = this._item.el.nativeElement.getBoundingClientRect();
    //     if (r.x != this._rect.x || r.y != this._rect.y || r.width != this._rect.width || r.height != this._rect.height) {
    //         this.display.next(this._item);
    //         this._rect = r;
    //     }
    // }

}
