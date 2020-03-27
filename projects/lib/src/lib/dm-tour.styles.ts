export const GLOBAL_STYLES = `
    #ngxDmTourRoot,
    #ngxDmTourLoading,
    #ngxDmTourBackdrop,
    #ngxDmTourDialogContainer {
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
        transition: opacity .5s;
    }
    #ngxDmTourRoot.ngx-dm-tour-show #ngxDmTourBackdrop {
        opacity: var(--ngx-dm-tour-backdrop-opacity, .3);
    }
    #ngxDmTourRoot.ngx-dm-tour-show #ngxDmTourDialog {
        opacity: 1;
    }
    #ngxDmTourRoot.ngx-dm-tour-show .ngx-dm-tour-text {
        opacity: 1;
    }
    #ngxDmTourBackdrop.ngx-dm-tour-dialog {
        background-color: var(--ngx-dm-tour-backdrop-color, black);
    }
    #ngxDmTourDialogContainer  {
        justify-content: center;
        align-items: center;
        display: flex;
        overflow: auto;
    }
    #ngxDmTourDialog {
        transition: opacity .5s;
        opacity: 0;
        min-width: 800px;
        min-height: 600px;
        background-color: white;
        box-shadow: 0 0 10px rgba(0,153,228,.5);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 10px 0;
        position: relative;
    }
    #ngxDmTourDialogTitle {
        color: #0099e4;
        padding: 0 16px 8px;
        font-weight: bold;
        font-size: 1.5em;
    }
    #ngxDmTourDialogDesc {
        position: relative;
        display: flex;
        flex: 1;
        flex-basis: 1e-9px;
    }
    #ngxDmTourDialogDescInner {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        padding: 10px;
    }
    #ngxDmTourDialogFooter {
        padding: 8px 8px 0 8px;
        text-align: right;
        margin-top: 2px;
    }
    .ngx-dm-tour-button {
        transition: all .15s;
        height: 26px;
        line-height: 1.5;
        position: relative;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        border: 1px solid #d9d9d9;
        cursor: pointer;
        padding: 0 8px;
        font-size: 14px;
        color: white;
        background-color: #0099e4;
        border-color: #1890ff;
        box-shadow: 0 2px 0 rgba(0,0,0,.045);
    }
    .ngx-dm-tour-button:hover {
        box-shadow: 0 2px 5px rgba(0,153,228,.5);
        top: 0 !important;
    }
    #ngxDmTourDialogBtnIndex:before {
        content: "Content Index"
    }
    #ngxDmTourDialogBtnControls{
        margin-left: 8px;
        position: absolute;
        top: -2px;
        right: 30px;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        padding: 0 8px;
        border-top: none;
    }
    #ngxDmTourDialogBtnControls:before {
        content: "Highlight Important Controls"
    }
    #ngxDmTourDialogBtnClose {
        position: absolute;
        right: 0;
        top: -2px;
        padding: 0 4px;
        border-radius: 0;
        border-bottom-left-radius: 50%;
        border-top: none;
        border-right: none;
    }
    #ngxDmTourDialogBtnClose:before {
        content: "\\01F5D9"
    }
    .ngx-dm-tour-text {
        transition: opacity .5s;
        opacity: 0;
        position: absolute;
        border: 2px solid white;
        border-radius: 8px;
        background: #0099e4;
        text-align: center;
        min-width: 70px;
        max-width: 400px;
        max-height: 200px;
        box-shadow: 0 0 4px rgba(0,0,0,.25);
    }
    .ngx-dm-tour-text > .ngx-dm-tour-text-inner {
        color: white;
        padding: 8px;
    }
    .ngx-dm-tour-text:after {
        border: 2px solid;
        border-color: transparent white white transparent;
        box-shadow: 2px 2px 2px rgba(0,0,0,.25);
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
