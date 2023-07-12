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

const RolerCoaster = {
    start: {
        x: 856,
        y: 78.5,
        speed: 0.5,
    },
    turn_1: {
        x: 762,
        y: 78.5,
        speed: 0.5,
    },
    turn_2: {
        x: 762,
        y: 127.5,
        speed: 0.5,
    },
    turn_3: {
        x: 700,
        y: 127.5,
        speed: 0.5,
    },
    turn_4: {
        x: 700,
        y: 238.5,
        speed: 0.5,
    },
    turn_5: {
        x: 475,
        y: 238.5,
        speed: 0.5,
    },
    turn_6: {
        x: 475,
        y: 287.5,
        speed: 0.5,
    },
    turn_7: {
        x: 315,
        y: 287.5,
        speed: 0.5,
    },
    turn_8: {
        x: 315,
        y: 215,
        speed: 0.5,
    },
    turn_9: {
        x: 350,
        y: 175,
        speed: 0.5,
    },
    turn_10: {
        x: 475,
        y: 175,
        speed: 0.5,
    },
    turn_11: {
        x: 475,
        y: 55,
        speed: 0.5,
    },
    turn_12: {
        x: 515,
        y: 15,
        speed: 0.5,
    },
    turn_13: {
        x: 950,
        y: 15,
        speed: 0.5,
    },
    turn_14: {
        x: 950,
        y: 78.5,
        speed: 0.5,
    },
    end: {
        x: 856,
        y: 78.5,
        speed: 0.5,
    },
}

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
                    x: 256, // 256 
                    y: 566, // 566
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

        this.load.image("Cloud", "https://0xsacul.github.io/ingals-community-island/public/cloud.png");
        this.load.image("RolerCoaster", "https://0xsacul.github.io/ingals-community-island/public/roler_coaster.png");
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

                    if (this.CheckPlayerDistance(247.5, 532.5)) return;

                    window.openModal({
                        npc: {
                            name: "Pedro",
                            clothing: Pedro,
                        },
                        jsx: "Howdy farmer, welcome on Ingals's Island! This Island has been created by the Ingalsians for the SFL community. Feel free to explore and have fun!",
                    });
                },
            },
            {
                x: 935,
                y: 290,
                npc: "Witch",
                clothing: Witch,
                onClick: () => {
                    if (this.CheckPlayerDistance(935, 290)) return;

                    this.CloudTeleportAnimation(106, 180);

                },
            },
            {
                x: 120,
                y: 195,
                npc: "Witch",
                clothing: Witch,
                onClick: () => {
                    if (this.CheckPlayerDistance(120, 195)) return;

                    this.CloudTeleportAnimation(920, 290);
                },
            },
            {
                x: 824,
                y: 110,
                npc: "Showman",
                clothing: Pedro,
                onClick: () => {
                    if (this.CheckPlayerDistance(824, 110)) return;

                    window.openModal({
                        npc: {
                            name: "Showman",
                            clothing: Pedro,
                        },
                        jsx: "Welcome to my Roler Coaster farmer! I still need a bit of time to finish it, but it the meantime you walk on it and enjoy the view! (aka Sacul didn't found a way to make it work like a real roler coaster yet).",
                    });

                    //this.RolerCoasterAnimation();
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

    CheckPlayerDistance(x, y) {
        let player_distance = Phaser.Math.Distance.Between(this.currentPlayer.x, this.currentPlayer.y, x, y);
        return player_distance > 40;
    }

    CloudTeleportAnimation(x, y) {
        // Spawn the cloud below the player
        this.cloud = this.add.sprite(this.currentPlayer.x, this.currentPlayer.y + 15, "Cloud");
        this.cloud.setScale(0.75);
        this.cloud.setDepth(1);

        // Calculate the distance between the player and the tp point
        let player_distance = Phaser.Math.Distance.Between(this.currentPlayer.x, this.currentPlayer.y, x, y);
        let cloud_distance = Phaser.Math.Distance.Between(this.cloud.x, this.cloud.y, x, y);

        // Move the cloud to the tp point
        this.tweens.add({
            targets: this.cloud,
            x: x,
            y: y + 15,
            duration: cloud_distance * 8,
            ease: 'Linear',
            onComplete: () => {
                this.cloud.destroy();
            }
        });

        // Move the player to the tp point
        this.tweens.add({
            targets: this.currentPlayer,
            x: x,
            y: y,
            duration: player_distance * 8,
            ease: 'Linear',
            onComplete: () => {
            }
        });
    }

    async RolerCoasterAnimation() {
        // Create the roller coaster path using an array of points
        const points = [
            RolerCoaster.start,
            RolerCoaster.turn_1,
            RolerCoaster.turn_2,
            RolerCoaster.turn_3,
            RolerCoaster.turn_4,
            RolerCoaster.turn_5,
            RolerCoaster.turn_6,
            RolerCoaster.turn_7,
            RolerCoaster.turn_8,
            RolerCoaster.turn_9,
            RolerCoaster.turn_10,
            RolerCoaster.turn_11,
            RolerCoaster.turn_12,
            RolerCoaster.turn_13,
            RolerCoaster.turn_14,
            RolerCoaster.end
        ];

        // Create the roller coaster path
        const path = this.add.path(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            path.lineTo(points[i].x, points[i].y);
        }

        // Create the roller coaster sprite
        const rollerCoaster = this.add.follower(path, RolerCoaster.start.x, RolerCoaster.start.y, "RolerCoaster");
        rollerCoaster.setScale(1);
        rollerCoaster.setDepth(1);

        // Calculate the distance between the player and the starting point
        const player_distance = Phaser.Math.Distance.Between(this.currentPlayer.x, this.currentPlayer.y, RolerCoaster.start.x, RolerCoaster.start.y);

        // Place the player on the roller coaster
        const playerOffset = player_distance / path.getLength(); // Calculate the player's offset on the path
        const playerPosition = path.getPoint(playerOffset); // Get the position on the path based on the offset
        if (this.currentPlayer) {
            this.currentPlayer.x = playerPosition.x;
            this.currentPlayer.y = playerPosition.y;
        } else {
            console.error("currentPlayer is not defined.");
            return;
        }

        // Start the roller coaster animation
        rollerCoaster.startFollow({
            duration: 10000,
            yoyo: false,
            repeat: 0,
            rotateToPath: true,
            verticalAdjust: true,
            onComplete: () => {
                rollerCoaster.destroy();
            }
        });

        // Make the player follow the roller coaster
        this.tweens.add({
            targets: this.currentPlayer,
            t: 1,
            duration: 10000,
            ease: 'Linear',
            onUpdate: () => {
                const playerOffset = this.currentPlayer.t;
                const playerPosition = path.getPoint(playerOffset);
                this.currentPlayer.x = playerPosition.x || this.currentPlayer.x;
                this.currentPlayer.y = playerPosition.y || this.currentPlayer.y;
            }
        });


    }



    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    Tweens(targets, x, y, duration, ease) {
        return new Promise(resolve => {
            this.tweens.add({
                targets: targets,
                x: x,
                y: y,
                duration: duration,
                ease: ease,
                onComplete: () => {
                    resolve();
                }
            });
        });
    }

}