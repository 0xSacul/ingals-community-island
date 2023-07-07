class ExternalScene extends window.BaseScene {
    constructor() {
        super({
            map: {
                tileset: "https://sacul.cloud/tileset.png",
            },
            player: {
                spawn: {
                    x: 151,
                    y: 977,
                },
            },
        });
    }
}