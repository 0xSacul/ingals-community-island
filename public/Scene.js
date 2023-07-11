const Pedro = {
    body: "Goblin Potion",
    hat: "Sleeping Otter",
    hair: "Buzz Cut",
    shirt: "SFL T-Shirt",
    pants: "Farmer Pants",
    tool: "Pirate Scimitar",
};

const Witch = {
    body: "Goblin Potion",
    hair: "White Long Hair",
    shirt: "Maiden Top",
    pants: "Farmer Pants",
    tool: "Dawn Lamp"
};

class ExternalScene extends window.BaseScene {
    constructor() {
        super({
            name: "community_island",
            map: {
                tilesetUrl: "https://0xsacul.github.io/ingals-community-island/tileset.png",
                //tilesetUrl: "http://localhost:5500/tileset.png",
            },
            player: {
                spawn: {
                    x: 256,
                    y: 566,
                },
            },
            mmo: {
                enabled: true,
                url: "wss://ingals.sacul.cloud/",
                //url: "ws://localhost:2567/",
                roomId: "local", // Need to be ingals_main once fixed on SFL side.
            },
        });
    }

    preload() {
        super.preload();

        this.load.bitmapFont(
            "Small 5x3",
            "world/small_3x5.png",
            "world/small_3x5.xml"
        );
        this.load.bitmapFont("pixelmix", "world/7px.png", "world/7px.xml");
    }

    create() {
        super.create();

        this.initialiseNPCs([
            {
                x: 247.5,
                y: 532.5,
                npc: "Pedro",
                clothing: Pedro,
                onClick: () => {
                    window.openModal({
                        npc: {
                            name: "Geoff",
                            clothing: npcClothing,
                        },
                        jsx: "Howdy farmer! Welcome on Ingals's Island! This is Island has been created by the Ingalsians for the SFL community. Feel free to explore and have fun!",
                    });
                },
            },
            {
                x: 935,
                y: 290,
                npc: "Witch",
                clothing: Witch,
                onClick: () => {
                    this.currentPlayer.x = 106;
                    this.currentPlayer.y = 180;
                },
            }, {
                x: 120,
                y: 195,
                npc: "Witch",
                clothing: Witch,
                onClick: () => {
                    this.currentPlayer.x = 920;
                    this.currentPlayer.y = 290;
                },
            },
        ]);
    }

    update() {
        super.update();
        /* 
            display player position for debugging
        */
        //console.log(this.currentPlayer.x, this.currentPlayer.y);
    }
}