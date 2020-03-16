import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

// import { DmTourConfig, DmTourConfigSection, DmTourConfigItem } from './dm-tour-config';

export class DmTourItem {
    id: string;
    index: number;
    path: string;
    position: string;
    el: ElementRef;
    baseEl: ElementRef;
    item: DmTourConfigSection | DmTourConfigItem;
}

@Injectable({
    providedIn: 'root'
})
export class DmTourService {

    display: Subject<DmTourItem> = new Subject();
    displayStates: { [id: string]: boolean } = {};
    displayStatesChanged: Subject<{ [id: string]: boolean }> = new Subject();
    private _sections: { [id: string]: DmTourItem } = {};
    private _items: { [id: string]: { [id: string]: DmTourItem } } = {};
    private _config: DmTourConfig;
    private _section: DmTourItem;
    private _item: DmTourItem;
    private _rect: DOMRect;
    private _subscription: any;
    private _sts: any;

    init(config: DmTourConfig) {
        if (config && config.sections) {
            this._config = config;
            for (let i = 0; i < config.sections.length; i++) {
                const section = config.sections[i];
                const sec = new DmTourItem();
                sec.id = section.id;
                sec.index = i;
                sec.path = section.id;
                sec.item = section;
                this._sections[sec.id] = sec;
                this._items[sec.id] = {};
                if (section.children) {
                    for (let j = 0; j < section.children.length; j++) {
                        const item = section.children[j];
                        const ti = new DmTourItem();
                        ti.id = item.id;
                        ti.index = j;
                        ti.path = sec.id + '/' + ti.id;
                        ti.item = item;
                        this._items[sec.id][ti.id] = ti;
                    }
                }
            }
        }
    }

    register(sectionId: string, itemId: string, el: ElementRef, position?: string) {
        if (!sectionId || !itemId || !el) {
            return;
        }
        if (!this._items[sectionId] || !this._sections[sectionId]) {
            return;
        }
        if (!this._items[sectionId][itemId]) {
            return;
        }
        this._items[sectionId][itemId].position = position;
        this._items[sectionId][itemId].el = el;
        this._items[sectionId][itemId].baseEl = this._sections[sectionId].el;
    }

    unregister(sectionId: string, itemId: string) {
        if (!this._config) {
            return;
        }
        if (this._item && this._item.id == itemId) {
            this._item = null;
            this._rect = null;
            if (this._subscription) {
                clearInterval(this._subscription);
                this._subscription = null;
            }
        }
        if (this._items[sectionId] && this._items[sectionId][itemId]) {
            delete this._items[sectionId][itemId].el;
        }
    }

    private _display(item: DmTourItem) {
        if (this.displayStates[item.path]) {
            return;
        }
        this._item = item;
        this._rect = item.el.nativeElement.getBoundingClientRect();
        this.display.next(item);
        if (this._subscription) {
            clearInterval(this._subscription);
        }
        this._subscription = setInterval(() => this._checkElement(), 100);
    }

    private _checkElement() {
        if (!this._item || !this._rect) {
            return;
        }
        const r: DOMRect = this._item.el.nativeElement.getBoundingClientRect();
        if (r.x != this._rect.x || r.y != this._rect.y || r.width != this._rect.width || r.height != this._rect.height) {
            this.display.next(this._item);
            this._rect = r;
        }
    }

}
