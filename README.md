# ngx-dm-tour

![npm version](https://img.shields.io/npm/v/@dimanoid/ngx-dm-tour/latest) ![bundle size](https://img.shields.io/bundlephobia/min/@dimanoid/ngx-dm-tour) ![build](https://travis-ci.com/Dimanoid/ngx-dm-tour.svg?branch=release) [![Coverage Status](https://coveralls.io/repos/github/Dimanoid/ngx-dm-tour/badge.svg?branch=release)](https://coveralls.io/github/Dimanoid/ngx-dm-tour?branch=release)

Demo page: https://dimanoid.github.io/ngx-dm-tour/

## Installation

Install the library and dependecies:

  `npm i -S @dimanoid/ngx-dm-tour`

Add module to imports:

```ts
import { DmTourModule } from '@dimanoid/ngx-dm-tour';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, CommonModule,
        .......
        DmTourModule  // <-------
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
