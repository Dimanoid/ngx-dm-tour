import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DmLibTplService {

    value: any;

    constructor() { }

    setValue(v: any) {
        this.value = v;
    }

    getValue(): any {
        return this.value;
    }

}
