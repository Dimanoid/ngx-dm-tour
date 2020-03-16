import { fakeAsync } from '@angular/core/testing';
import { SpectatorHost, createHostFactory } from '@ngneat/spectator/jest';

import { DmTourService } from '../dm-tour.service';
import { DmTourRootComponent } from './dm-tour-root.component';

describe('DmTourComponent', () => {
    let spectator: SpectatorHost<DmTourRootComponent>;
    const createHost = createHostFactory({
        component: DmTourRootComponent,
        providers: [DmTourService]
    });

    it('should be created', fakeAsync(() => {
        spectator = createHost(`<dm-tour-root></dm-tour-root>`);
        expect(spectator.component).toBeTruthy();
    }));

});
