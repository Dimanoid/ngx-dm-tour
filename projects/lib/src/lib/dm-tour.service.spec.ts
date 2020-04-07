import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { HttpClient } from '@angular/common/http';

import { DmTourService } from './dm-tour.service';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe('DmTourService', () => {
    jest.mock('resize-observer-polyfill', () => { return ResizeObserver; });
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
