import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DmTourService } from './dm-tour.service';

describe('DmTourService', () => {
    let spectator: SpectatorService<DmTourService>;
    const createService = createServiceFactory(DmTourService);

    beforeEach(() => spectator = createService());

    it('should be created', () => {
        expect(spectator.service).toBeTruthy();
    });

});
