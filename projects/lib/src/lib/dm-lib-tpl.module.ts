import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DmLibTplComponent } from './tpl-component/dm-lib-tpl.component';

@NgModule({
    declarations: [
        DmLibTplComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DmLibTplComponent
    ]
})
export class DmLibTplModule { }
