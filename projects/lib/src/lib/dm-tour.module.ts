import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DmTourDirective } from './dm-tour.directive'

@NgModule({
    declarations: [
        DmTourDirective
    ],
    imports: [
        CommonModule, HttpClientModule
    ],
    exports: [
        DmTourDirective
    ]
})
export class DmTourModule { }
