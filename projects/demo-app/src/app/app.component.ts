import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Point } from './dm-divider.module';
import { DmTourService } from '@dimanoid/ngx-dm-tour';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    clicked: boolean = false;

    public divider: {
        [name: string]: {
            min: number,
            max: number,
            inverse?: boolean,
            vertical?: boolean,
            moving?: boolean,
            start?: number,
            size?: number
        }
    } = {};

    constructor(private _tour: DmTourService) {
        this.divider['d1'] = { min: 200, max: 700, vertical: true, size: 300 };
    }

    ngOnInit() {
        setTimeout(() => {
            if (!this.clicked) {
                this.clicked = true;
                this._tour.showControlsHelp('s0');
            }
        }, 5000);
    }

    log(...args) {
        console.log(...args);
    }

    dividerDragStart(name: string, p: Point) {
        if (this.divider[name]) {
            this.divider[name].moving = true;
            this.divider[name].start = +this.divider[name].size;
        }
    }

    dividerDragEnd(name: string, p: Point) {
        if (this.divider[name]) {
            this.divider[name].moving = false;
            this.__dividerCalc(name, p);
        }
    }

    dividerMove(name: string, p: Point) {
        if (this.divider[name]) {
            this.__dividerCalc(name, p);
        }
    }

    private __dividerCalc(name: string, p: Point) {
        if (this.divider[name]) {
            const axis = this.divider[name].vertical ? 'x' : 'y';
            const m = this.divider[name].inverse ? -1 : 1;
            let size = +this.divider[name].start + (m * p[axis]);
            if (size < this.divider[name].min) {
                size = this.divider[name].min;
            }
            if (size > this.divider[name].max) {
                size = this.divider[name].max;
            }
            this.divider[name].size = size;
        }
    }

    showHelp(section: string) {
        this.clicked = true;
        this._tour.showHelp(section);
    }

    showControlsHelp(section: string) {
        this.clicked = true;
        this._tour.showControlsHelp(section);
    }
}
