import { fakeAsync } from '@angular/core/testing';
import { SpectatorHost, createHostFactory } from '@ngneat/spectator/jest';

import { DmTourService } from '../dm-tour.service';
import { DmTourComponent } from './dm-tour.component';

describe('DmTourComponent', () => {
    let spectator: SpectatorHost<DmTourComponent>;
    const createHost = createHostFactory({
        component: DmTourComponent,
        providers: [DmTourService]
    });

    it('should be created', fakeAsync(() => {
        spectator = createHost(`<dm-tour-component></dm-tour-component>`);
        expect(spectator.component).toBeTruthy();
    }));

});
