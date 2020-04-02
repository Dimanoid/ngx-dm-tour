import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DmDividerModule } from './dm-divider.module';

import { NzButtonModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

import { DmTableModule } from '@dimanoid/ngx-dm-table';

import { DmTourModule } from '@dimanoid/ngx-dm-tour';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, CommonModule,
        FormsModule, ReactiveFormsModule,
        NzButtonModule,
        DmTableModule,
        DmDividerModule, DmTourModule
    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
