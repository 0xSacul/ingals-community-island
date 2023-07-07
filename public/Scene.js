let frog;
let bubble;
let direction = "right";
let steve_soubrette;
let skeleton_pet;

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

    preload() {
        super.preload();

        this.load.spritesheet("frog", "world/frog.png", {
            frameWidth: 16,
            frameHeight: 27,
        });

        this.load.image('bubbleKey', 'world/speech_bubble.png');
        this.load.image('skeletonPet', 'https://sacul.cloud/skeleton_walk.gif');

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

        skeleton_pet = this.add.image(151, 977, 'skeletonPet');
        skeleton_pet.setScale(1);

        // Create the NPC sprite and set its position
        skeleton_pet.x = 151;
        skeleton_pet.y = 800;

        // Create a idle animation for the NPC using the first frame of the gif
        this.anims.create({
            key: 'skeleton_idle',
            frames: [{
                key: 'skeletonPet',
                frame: 0
            }],
            frameRate: 10,
            repeat: -1
        });




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
            skeleton_pet.x += dx / distance * speed;
            skeleton_pet.y += dy / distance * speed;
        } else {
            //skeleton_pet.anims.stop();
        }
    }



}