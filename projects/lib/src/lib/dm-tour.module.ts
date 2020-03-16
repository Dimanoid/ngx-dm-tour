import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DmTourComponent } from './dm-tour/dm-tour.component';

@NgModule({
    declarations: [
        DmTourComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DmTourComponent
    ]
})
export class DmTourModule { }
