import { Directive, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DmTourService } from './dm-tour.service';

@Directive({
    selector: '[dm-tour]'
})
export class DmTourDirective implements AfterViewInit, OnDestroy {
    @Input('dm-tour') item: string | { id: string, position: string, shape: string };

    constructor(private _el: ElementRef, private _ts: DmTourService) {
    }

    ngAfterViewInit() {
        if (!this.item) {
            return;
        }
        const path = typeof this.item == 'string' ? this.item.split('.') : this.item.id.split('.');
        if (!path || path.length != 2) {
            console.warn('[dm-tour] tour element ID must be in form "sectionID.ItemID": ', this.item);
            return;
        }
        this._ts.registerControl(
            path[0],
            path[1],
            this._el,
            typeof this.item == 'string' ? undefined : this.item.position,
            typeof this.item == 'string' ? undefined : this.item.shape
        );
    }

    ngOnDestroy() {
        if (!this.item) {
            return;
        }
        const path = typeof this.item == 'string' ? this.item.split('.') : this.item.id.split('.');
        if (!path || path.length != 2) {
            return;
        }
        this._ts.unregisterControl(path[0], path[path.length - 1]);
    }

}
