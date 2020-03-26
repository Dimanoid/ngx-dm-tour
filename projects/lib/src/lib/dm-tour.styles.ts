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
    .ngx-dm-tour-text {
        position: absolute;
        border: 2px solid white;
        border-radius: 8px;
        background: #0099e4;
        text-align: center;
        min-width: 70px;
        max-width: 400px;
        max-height: 200px;
        box-shadow: 0 0 4px rgba(0, 0, 0, .25);
    }
    .ngx-dm-tour-text > .ngx-dm-tour-text-inner {
        color: white;
        padding: 8px;
    }
    .ngx-dm-tour-text:after {
        border: 2px solid;
        border-color: transparent white white transparent;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, .25);
        background: #0099e4;
        content: " ";
        position: absolute;
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-top-left:after {
        bottom: -8px;
        left: 8px;
        width: 16px;
        height: 16px;
        transform: rotate(45deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-top-center:after {
        bottom: -8px;
        left: calc(50% - 8px);
        width: 16px;
        height: 16px;
        transform: rotate(45deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-top-right:after {
        bottom: -8px;
        right: 8px;
        width: 16px;
        height: 16px;
        transform: rotate(45deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-bottom-left:after {
        top: -8px;
        left: 8px;
        width: 16px;
        height: 16px;
        transform: rotate(-135deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-bottom-center:after {
        top: -8px;
        left: calc(50% - 8px);
        width: 16px;
        height: 16px;
        transform: rotate(-135deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-bottom-right:after {
        top: -8px;
        right: 8px;
        width: 16px;
        height: 16px;
        transform: rotate(-135deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-right-top:after {
        top: 8px;
        left: -8px;
        width: 16px;
        height: 16px;
        transform: rotate(135deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-right-center:after {
        top: calc(50% - 8px);
        left: -8px;
        width: 16px;
        height: 16px;
        transform: rotate(135deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-right-bottom:after {
        bottom: 8px;
        left: -8px;
        width: 16px;
        height: 16px;
        transform: rotate(135deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-left-top:after {
        top: 8px;
        right: -8px;
        width: 16px;
        height: 16px;
        transform: rotate(-45deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-left-center:after {
        top: calc(50% - 8px);
        right: -8px;
        width: 16px;
        height: 16px;
        transform: rotate(-45deg);
    }
    .ngx-dm-tour-text.ngx-dm-tour-text-left-bottom:after {
        bottom: 8px;
        right: -8px;
        width: 16px;
        height: 16px;
        transform: rotate(-45deg);
    }
`;
