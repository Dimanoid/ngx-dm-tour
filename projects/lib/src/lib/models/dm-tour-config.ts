export class DmTourConfig {
    rootPath: string = '/assets/help';
    loadIndexOnStart: boolean = true;
    loaderHtml: string = `
        <span style="color: steelblue;
            text-shadow: 0 0 10px white, 0 0 10px white, 0 0 20px white, 0 0 20px white, 0 0 30px white, 0 0 30px white;
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            font-weight: bold;
            font-size: 30px;
            transform: translate(-50%, -50%);"
        >
            Loading...
        </span>
    `;
}
