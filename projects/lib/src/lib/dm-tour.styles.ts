export const GLOBAL_STYLES = `
    #ngxDmTourRoot,
    #ngxDmTourLoading,
    #ngxDmTourBackdrop {
        position: fixed;
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
    .ngx-dm-tour-tooltip {
        position: absolute;
        border: 2px solid rgba(0, 0, 150, .2);
        border-radius: 8px;
        background: white;
        text-align: center;
        min-width: 70px;
        max-width: 400px;
    }
    .ngx-dm-tour-tooltip > .ngx-dm-tour-tooltip-inner {
        color: #008;
        padding: 8px;
    }
    .ngx-dm-tour-tooltip:after {
        border: 2px solid;
        border-color: transparent rgba(0, 0, 150, .2) rgba(0, 0, 150, .2) transparent;
        background: white;
        content: " ";
        position: absolute;
    }
    .ngx-dm-tour-tooltip.ngx-dm-tour-tooltip-right:after {
        right: -9px;
        top: calc(50% - 8px);
        width: 16px;
        height: 16px;
        transform: rotate(-45deg);
    }
    .ngx-dm-tour-tooltip.ngx-dm-tour-tooltip-bottom:after {
        bottom: -9px;
        left: calc(50% - 8px);
        width: 16px;
        height: 16px;
        transform: rotate(45deg);
    }
    .ngx-dm-tour-tooltip.ngx-dm-tour-tooltip-left:after {
        left: -9px;
        top: calc(50% - 8px);
        width: 16px;
        height: 16px;
        transform: rotate(-135deg);
    }
    .ngx-dm-tour-tooltip.ngx-dm-tour-tooltip-top:after {
        top: -9px;
        left: calc(50% - 8px);
        width: 16px;
        height: 16px;
        transform: rotate(135deg);
    }
`;
