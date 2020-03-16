import {
    Component, OnInit, AfterViewInit,
    ChangeDetectionStrategy, ViewEncapsulation,
    Input, HostBinding,
    ElementRef, ChangeDetectorRef, NgZone,
    Output, EventEmitter, OnChanges, SimpleChanges, AfterContentInit
} from '@angular/core';
import { InputNumber, InputBoolean } from '../utils';

import { DmLibTplService } from '../dm-lib-tpl.service';

export const MIN_ITEM_SIZE = 30;

export interface DmTableSort {
    colId: string;
    order: number;
}

export interface DmTableRowEvent {
    index: number;
    row: any;
    event: MouseEvent;
}

export interface DmTableHeaderEvent {
    colId: string;
    index: number;
    first: boolean;
    last: boolean;
    event: MouseEvent;
}

@Component({
    selector: 'dm-lib-tpl-component',
    exportAs: 'dmLibTplComponent',
    templateUrl: './dm-lib-tpl.component.html',
    styleUrls: ['./dm-lib-tpl.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DmLibTplComponent implements OnInit, AfterViewInit, OnChanges, AfterContentInit {
    @HostBinding('class.tpl-component-css-class') _hostCss = true;

    @Input() @InputBoolean() booleanProperty: boolean = false;
    
    @Input() @InputNumber() numberProperty: number;
    @Output() numberPropertyChange: EventEmitter<number> = new EventEmitter();

    constructor(private _elemRef: ElementRef, private _cdr: ChangeDetectorRef, private _ngZone: NgZone, private _srv: DmLibTplService) {
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
