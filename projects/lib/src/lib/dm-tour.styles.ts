export const GLOBAL_STYLES = `
    #ngxDmTourLoading, #ngxDmTourBackdrop {
        position: fixed;
        z-index: 9999;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
    }
    #ngxDmTourLoading {
        background-color: transparent;
        transition: background-color .5s;
    }
    #ngxDmTourBackdrop {
        opacity: 0;
        transition: opacity 1s;
    }
`;
