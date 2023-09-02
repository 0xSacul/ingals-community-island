import {
  Clothing,
  Pedro,
  Witch,
  Coaster,
  CoasterPoint,
  RolerCoaster,
} from "./types";
import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import { TestComponent } from "./Components/Test";

export default class ExternalScene extends window.BaseScene {
  constructor() {
    super({
      name: "local",
      map: {
        tilesetUrl:
          "https://0xsacul.github.io/ingals-community-island/tileset.png", // http://localhost:5500/tileset.png
      },
      player: {
        spawn: {
          x: 256, // 256  824
          y: 566, // 566  140
        },
      },
      mmo: {
        enabled: true,
        url: "wss://plaza.sacul.cloud/", // ws://localhost:2567/
        roomId: "ingals_room", // Need to be ingals_main once fixed on SFL side.
        serverId: "ingals_room",
      },
    });
  }

  preload() {
    super.preload();

    this.load.bitmapFont(
      "Teeny Tiny Pixls",
      "world/Teeny Tiny Pixls5.png",
      "world/Teeny Tiny Pixls5.xml"
    );
    this.load.bitmapFont(
      "Small 5x3",
      "world/small_3x5.png",
      "world/small_3x5.xml"
    );
    this.load.bitmapFont("pixelmix", "world/7px.png", "world/7px.xml");

    this.load.image(
      "Cloud",
      "https://0xsacul.github.io/ingals-community-island/pngs/cloud.png"
    );
    this.load.image(
      "RolerCoaster",
      "https://0xsacul.github.io/ingals-community-island/pngs/roler_coaster.png"
    );

    this.load.image(
      "TrustedUserHalo",
      "https://0xsacul.github.io/ingals-community-island/pngs/halo.png"
    );

    this.load.spritesheet(
      "TrustedUserAnimatedHalo",
      "https://0xsacul.github.io/ingals-community-island/pngs/anim_halo.png",
      { frameWidth: 96, frameHeight: 64 }
    );

    // Human choping tree animation
    this.load.spritesheet(
      "HumanChopTree",
      "https://0xsacul.github.io/ingals-community-island/pngs/tree_cut/human_axe_anim.png",
      { frameWidth: 96, frameHeight: 64 }
    );
  }

  create() {
    super.create();

    this.initialiseNPCs([
      {
        x: 280,
        y: 532.5,
        npc: "Pedro",
        clothing: Pedro,
        onClick: () => {
          if (this.CheckPlayerDistance(280, 532.5)) return;

          window.openModal({
            npc: {
              name: "Pedro",
              clothing: Pedro,
            },
            type: "speaking",
            messages: [
              {
                text: "Howdy Farmer! Welcome on Ingals's Island! This Island has been created by the Ingalsians for the SFL community. Feel free to explore and have fun!",
              },
              {
                text: "Pedro est-il gay?",
                actions: [
                  {
                    text: "Oui",
                    cb: () => {
                      window.alert("Bon toutou");
                    },
                  },
                  {
                    text: "Non",
                    cb: () => {
                      window.alert("Bah nique ta mère alors");
                    },
                  },
                ],
              },
            ],
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

          /*window.openModal({
                    npc: {
                        name: "Showman",
                        clothing: Pedro,
                    },
                    jsx: "Welcome to my Roler Coaster farmer! I still need a bit of time to finish it, but it the meantime you walk on it and enjoy the view! (aka Sacul didn't found a way to make it work like a real roler coaster yet).",
                });*/

          this.RolerCoasterAnimation();
        },
      },
    ]);

    this.humanChopTree = this.add.sprite(
      this.currentPlayer.x,
      this.currentPlayer.y + 15,
      "HumanChopTree"
    );
    this.humanChopTree.setDepth(1000000000);
    this.humanChopTree.setVisible(true);
    this.humanChopTree.setScale(1);

    // Anims

    this.anims.create({
      key: "HumanChopTree",
      frames: this.anims.generateFrameNumbers("HumanChopTree", {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Play Anims

    this.humanChopTree.anims.play("HumanChopTree", true);

    // For local testing, allow Scene refresh with spacebar
    this.events.on("shutdown", () => {
      this.cache.tilemap.remove("local");
      this.scene.remove("local");
    });
    const spaceBar = this.input.keyboard.addKey("SPACE");
    spaceBar.on("down", () => {
      this.scene.start("default");
    });

    this.currentPlayer.alive = true;
  }

  update() {
    super.update();
    /* 
        display player position for debugging
    */
    //console.log(this.currentPlayer.x, this.currentPlayer.y);
  }

  CheckPlayerDistance(x: number, y: number) {
    let player_distance = Phaser.Math.Distance.Between(
      this.currentPlayer.x,
      this.currentPlayer.y,
      x,
      y
    );
    return player_distance > 40;
  }

  CloudTeleportAnimation(x: number, y: number) {
    // Spawn the cloud below the player
    this.cloud = this.add.sprite(
      this.currentPlayer.x,
      this.currentPlayer.y + 15,
      "Cloud"
    );
    this.cloud.setScale(0.75);
    this.cloud.setDepth(1);

    // Calculate the distance between the player and the tp point
    let player_distance = Phaser.Math.Distance.Between(
      this.currentPlayer.x,
      this.currentPlayer.y,
      x,
      y
    );
    let cloud_distance = Phaser.Math.Distance.Between(
      this.cloud.x,
      this.cloud.y,
      x,
      y
    );

    // Move the cloud to the tp point
    this.tweens.add({
      targets: this.cloud,
      x: x,
      y: y + 15,
      duration: cloud_distance * 8,
      ease: "Linear",
      onComplete: () => {
        this.cloud.destroy();
      },
    });

    // Move the player to the tp point
    this.tweens.add({
      targets: this.currentPlayer,
      x: x,
      y: y,
      duration: player_distance * 8,
      ease: "Linear",
      onComplete: () => {},
    });
  }

  RolerCoasterAnimation() {
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
      RolerCoaster.end,
    ];

    // Create the roller coaster path
    const path = this.add.path(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y);
    }

    // Create the roller coaster sprite
    const rollerCoaster = this.add.follower(
      path,
      RolerCoaster.start.x,
      RolerCoaster.start.y,
      "RolerCoaster"
    );
    rollerCoaster.setScale(1);
    rollerCoaster.setDepth(1);

    // Make the roller coaster sprite follow the path
    rollerCoaster.startFollow({
      duration: 20000,
      yoyo: false,
      repeat: 0,
      rotateToPath: false,
      ease: "Linear",
      onComplete: () => {
        rollerCoaster.destroy();
      },
    });

    // Put the player on the roller coaster
    this.currentPlayer.x = RolerCoaster.start.x;
    this.currentPlayer.y = RolerCoaster.start.y;

    // Update the player position to follow the roller coaster
    this.tweens.add({
      targets: this.currentPlayer,
      x: rollerCoaster.x,
      y: rollerCoaster.y,
      duration: 20000,
      ease: "Linear",
      onUpdate: () => {
        this.currentPlayer.x = rollerCoaster.x;
        this.currentPlayer.y = rollerCoaster.y - 10;
      },
      onComplete: () => {
        this.currentPlayer.x = 856;
        this.currentPlayer.y = 96;
      },
    });
  }

  async handleDeath() {
    this.currentPlayer.alive = false;
    this.currentPlayer.setAlpha(0);
    this.currentPlayer.body.moves = false;

    const deathBackground = this.add.rectangle(
      this.currentPlayer.x,
      this.currentPlayer.y,
      2048,
      2048,
      0x000000
    );

    const deathTextTitle = this.add.bitmapText(
      this.currentPlayer.x - 100,
      this.currentPlayer.y - 100,
      "pixelmix",
      "You died!",
      16
    );
    deathTextTitle.setAlpha(1000000000);

    // Change the color of the text to red
    deathTextTitle.setTint(0xff0000, 0xff0000, 0xff0000, 0xff0000);
    deathTextTitle.setAlpha(1);
    // Make the text flash
    this.tweens.add({
      targets: deathTextTitle,
      alpha: 0.2,
      duration: 1000,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });

    const deathTextRespawn = this.add.bitmapText(
      this.currentPlayer.x - 100,
      this.currentPlayer.y - 50,
      "pixelmix",
      "Click anywhere on the screen to respawn.",
      8
    );

    // text-center
    deathTextTitle.x -= deathTextTitle.width / 2;
    deathTextRespawn.x -= deathTextRespawn.width / 2;

    // Set the camera on the texts but move the camera bit on the left to center the texts
    this.cameras.main.startFollow(deathTextRespawn, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(0, 100);

    deathBackground.setDepth(999999999);
    deathTextTitle.setDepth(999999999);
    deathTextRespawn.setDepth(999999999);

    // Respawn the player when the player click anywhere on the screen
    await this.sleep(1000);

    this.input.on("pointerdown", () => {
      console.log("respawn");
      this.respawn();
      deathBackground.destroy();
      deathTextTitle.destroy();
      deathTextRespawn.destroy();
    });
  }

  respawn() {
    // Respawn the player
    this.currentPlayer.alive = true;
    this.currentPlayer.setAlpha(1);
    this.currentPlayer.body.moves = true;
    this.currentPlayer.x = 256;
    this.currentPlayer.y = 566;
    this.cameras.main.stopFollow();
    this.cameras.main.setDeadzone(0, 0);
    this.cameras.main.startFollow(this.currentPlayer);
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

window.ExternalScene = ExternalScene;
