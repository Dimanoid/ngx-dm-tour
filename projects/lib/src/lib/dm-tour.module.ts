import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DmTourRootComponent } from './tour-root/dm-tour-root.component';
import { DmTourDirective } from './dm-tour.directive'

@NgModule({
    declarations: [
        DmTourRootComponent, DmTourDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DmTourRootComponent, DmTourDirective
    ]
})
export class DmTourModule { }
