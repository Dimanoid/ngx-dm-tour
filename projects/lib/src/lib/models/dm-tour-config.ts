import { InjectionToken } from '@angular/core';

export type DmTourShapeType = 'auto' | 'circle' | 'square';

export interface IDmTourConfig {
    rootPath?: string;
    loadIndexOnStart?: boolean;
    loaderHtml?: string;
    defaultShape?: DmTourShapeType;
    customCssClass?: string;
}

export class DmTourConfig implements IDmTourConfig {
    rootPath = 'assets/help';
    loadIndexOnStart = true;
    loaderHtml = `
        <span style="color: steelblue;
            text-shadow: 0 0 10px white, 0 0 10px white, 0 0 20px white, 0 0 20px white, 0 0 30px white, 0 0 30px white;
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            font-weight: bold;
            font-size: 30px;
            transform: translate(-50%, -50%);"
        >
            Loading...
        </span>
    `;
    defaultShape: DmTourShapeType = 'auto';
    customCssClass: string;

    constructor(json?: IDmTourConfig) {
        this.apply(json);
    }

    apply(json?: IDmTourConfig): DmTourConfig {
        if (json) {
            for (const fn of Object.keys(json)) {
                if (json[fn] !== undefined) {
                    this[fn] = json[fn];
                }
            }
        }
        return this;
    }
}

export const DM_TOUR_CONF = new InjectionToken<IDmTourConfig>('ngx-dm-tour-config');
