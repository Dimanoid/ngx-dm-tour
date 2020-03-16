import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DmLibTplService } from './dm-lib-tpl.service';

describe('DmLibTplService', () => {
    let spectator: SpectatorService<DmLibTplService>;
    const createService = createServiceFactory(DmLibTplService);

    beforeEach(() => spectator = createService());

    it('should be created', () => {
        expect(spectator.service).toBeTruthy();
    });

    it('should not has default value', () => {
        const v = spectator.service.getValue();
        expect(v).toBeUndefined();
    });

    it('should set new value', () => {
        spectator.service.setValue(42);
        const v = spectator.service.getValue();
        expect(v).toEqual(42);
    });
});
