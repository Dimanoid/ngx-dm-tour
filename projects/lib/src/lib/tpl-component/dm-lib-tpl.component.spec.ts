import { fakeAsync, flush } from '@angular/core/testing';
import { SpectatorHost, createHostFactory } from '@ngneat/spectator/jest';

import { DmLibTplService } from '../dm-lib-tpl.service';
import { DmLibTplComponent } from './dm-lib-tpl.component';

describe('DmLibTplComponent', () => {
    let spectator: SpectatorHost<DmLibTplComponent>;
    const createHost = createHostFactory({
        component: DmLibTplComponent,
        providers: [DmLibTplService]
    });

    it('should be created and display false', fakeAsync(() => {
        spectator = createHost(`<dm-lib-tpl-component></dm-lib-tpl-component>`);
        expect(spectator.component).toBeTruthy();
        flush();
        spectator.detectChanges();
        expect(spectator.query('.dm-lib-tpl-component-root')).toExist();
        expect(spectator.query('.dm-lib-tpl-component-root')).toHaveText('Boolean property: false');
        expect(spectator.query('.dm-lib-tpl-component-root > div.dm-lib-tpl-component-number')).not.toExist();
    }));

    it('should display number when boolean == true', fakeAsync(() => {
        spectator = createHost(`<dm-lib-tpl-component></dm-lib-tpl-component>`);
        expect(spectator.component).toBeTruthy();
        spectator.setInput({
            booleanProperty: true,
            numberProperty: 42
        });
        flush();
        spectator.detectChanges();
        expect(spectator.query('.dm-lib-tpl-component-root')).toExist();
        expect(spectator.query('.dm-lib-tpl-component-root')).toHaveText('Boolean property: true');
        expect(spectator.query('.dm-lib-tpl-component-root > div.dm-lib-tpl-component-number')).toExist();
        expect(spectator.query('.dm-lib-tpl-component-root > div.dm-lib-tpl-component-number')).toHaveText('Number property: 42');
    }));

});
