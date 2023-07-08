let frog;
let bubble;
let direction = "right";
let steve_soubrette;
let skeleton_pet;

class ExternalScene extends window.BaseScene {
    constructor() {
        super({
            map: {
                tilesetUrl: "https://0xsacul.github.io/ingals-community-island/tileset.png",
            },
            player: {
                spawn: {
                    x: 151,
                    y: 977,
                },
            },
        });
    }

    preload() {
        super.preload();

        this.load.spritesheet("frog", "world/frog.png", {
            frameWidth: 16,
            frameHeight: 27,
        });

        this.load.image('bubbleKey', 'world/speech_bubble.png');
        this.load.spritesheet('skeletonWalking', 'https://sacul.cloud/skeleton_walk_strip8.png', { frameWidth: 64, frameHeight: 64, frameMax: 8 });
        this.load.spritesheet('skeletonIdle', 'https://sacul.cloud/skeleton_idle_strip6.png', {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.bitmapFont(
            "Small 5x3",
            "world/small_3x5.png",
            "world/small_3x5.xml"
        );
        this.load.bitmapFont("pixelmix", "world/7px.png", "world/7px.xml");

    }

    create() {
        super.create();

        // Create the frog sprite and set its position
        frog = this.add.sprite(135, 977, "frog");

        // Set the frog's position
        frog.x = 90
        frog.y = 850; // Adjust newY to the desired y-coordinate

        // Add text to the bubble using Bitmap Text
        const text = this.add.bitmapText(0, 0, 'pixelmix', '', 3.5); // Replace 'fontKey' with your own font key and adjust the font size as needed
        text.setMaxWidth(40);
        text.setOrigin(0.5);
        text.setDepth(2);

        // Create the bubble using rexNinePatch
        bubble = this.add.rexNinePatch({
            x: frog.x,
            y: frog.y,
            width: text.width + 20,
            height: text.height,
            key: "speech_bubble",
            columns: [5, 2, 2],
            rows: [2, 3, 4],
            baseFrame: undefined,
            getFrameNameCallback: undefined
        });

        bubble.setScale(direction === "right" ? 1 : -1, 1);
        bubble.setAlpha(0.8);
        bubble.setDepth(1);
        bubble.setVisible(false);

        //interact with the frog
        frog.setInteractive();

        frog.on('pointerdown', function (pointer) {
            // Toggle the visibility of the bubble and set the text content when the frog is clicked
            bubble.x = frog.x
            bubble.y = frog.y - 20;
            text.x = bubble.x;
            text.y = bubble.y;

            bubble.setVisible(!bubble.visible);
            text.setText(bubble.visible ? 'Hello World' : '');

            this.currentPlayer.x = frog.x;
            this.currentPlayer.y = frog.y;


            setTimeout(function () {
                bubble.setVisible(false);
                text.setText('');
            }, 5000);
        }, this);


        /* steve_soubrette = this.add.image(151, 977, 'steveSoubrette');
        steve_soubrette.setScale(0.05); */

        skeleton_pet = this.physics.add.sprite(151, 977, 'skeletonWalking');
        skeleton_pet.setScale(1);


        this.anims.create({
            key: 'skeleton_walk',
            frames: this.anims.generateFrameNumbers('skeletonWalking', { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            repeat: -1,
            frameRate: 10
        });

        this.anims.create({
            key: 'skeleton_idle',
            frames: this.anims.generateFrameNumbers('skeletonIdle', {
                start: 0,
                end: 5
            }),
            repeat: -1,
            frameRate: 10
        });

        skeleton_pet.anims.play('skeleton_idle', true);
    }

    update() {
        super.update();
        // Calculate the distance between the player and the NPC
        const dx = this.currentPlayer.x - skeleton_pet.x;
        const dy = this.currentPlayer.y - skeleton_pet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Set the NPC's movement speed
        const speed = 1; // Adjust the speed as needed

        // Adjust the NPC's position to follow the player with walking animation
        if (distance > 20) {
            //skeleton_pet.x += dx / distance * speed;
            //skeleton_pet.y += dy / distance * speed;
            skeleton_pet.anims.play('skeleton_walk', true);
            //skeleton_pet.anims.stop('skeleton_idle', true);

        } else {
            skeleton_pet.anims.stop('skeleton_walk', true);
            //skeleton_pet.anims.play('skeleton_idle', true);
        }
    }



}