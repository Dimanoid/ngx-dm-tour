import {
    Component, OnInit, AfterViewInit,
    ChangeDetectionStrategy, ViewEncapsulation,
    Input, HostBinding,
    ElementRef, ChangeDetectorRef, NgZone,
    Output, EventEmitter, OnChanges, SimpleChanges, AfterContentInit
} from '@angular/core';
import { InputNumber, InputBoolean } from '../utils';

import { DmTourService } from '../dm-tour.service';

export const MIN_ITEM_SIZE = 30;

@Component({
    selector: 'dm-tour-root',
    exportAs: 'dmTourComponent',
    templateUrl: './dm-tour-root.component.html',
    styleUrls: ['./dm-tour-root.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DmTourRootComponent implements OnInit, AfterViewInit, OnChanges, AfterContentInit {
    @HostBinding('class.tpl-component-css-class') _hostCss = true;

    @Input() @InputBoolean() booleanProperty: boolean = false;

    @Input() @InputNumber() numberProperty: number;
    @Output() numberPropertyChange: EventEmitter<number> = new EventEmitter();

    constructor(private _elemRef: ElementRef, private _cdr: ChangeDetectorRef, private _ngZone: NgZone, private _srv: DmTourService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngAfterContentInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

}
