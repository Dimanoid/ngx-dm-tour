import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { HttpClient } from '@angular/common/http';

import { DmTourService } from './dm-tour.service';

describe('DmTourService', () => {
    let spectator: SpectatorService<DmTourService>;
    const createService = createServiceFactory({
        service: DmTourService,
        mocks: [HttpClient]
    });

    beforeEach(() => spectator = createService());

    it('should be created', () => {
        expect(spectator.service).toBeTruthy();
    });

});
