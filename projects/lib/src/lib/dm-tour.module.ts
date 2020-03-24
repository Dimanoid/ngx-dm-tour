import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DmTourRootComponent } from './tour-root/dm-tour-root.component';
import { DmTourDirective } from './dm-tour.directive'

@NgModule({
    declarations: [
        DmTourRootComponent, DmTourDirective
    ],
    imports: [
        CommonModule, HttpClientModule
    ],
    exports: [
        DmTourRootComponent, DmTourDirective
    ]
})
export class DmTourModule { }
