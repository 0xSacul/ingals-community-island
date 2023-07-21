import {
  Clothing,
  Pedro,
  Witch,
  Coaster,
  CoasterPoint,
  RolerCoaster,
} from "./types";
import Phaser from "phaser";

export default class ExternalScene extends window.BaseScene {
  constructor() {
    super({
      name: "community_island",
      map: {
        tilesetUrl:
          "https://0xsacul.github.io/ingals-community-island/tileset.png",
        //tilesetUrl: "http://localhost:5500/tileset.png",
      },
      player: {
        spawn: {
          x: 256, // 256  824
          y: 566, // 566  140
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

    this.load.image(
      "Cloud",
      "https://0xsacul.github.io/ingals-community-island/public/cloud.png"
    );
    this.load.image(
      "RolerCoaster",
      "https://0xsacul.github.io/ingals-community-island/public/roler_coaster.png"
    );

    this.load.spritesheet(
      "TreeCut",
      "http://localhost:5500/public/tree_cut_anim.png",
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

    // For local testing, allow Scene refresh with spacebar
    this.events.on("shutdown", () => {
      this.cache.tilemap.remove("community_island");
      this.scene.remove("community_island");
    });
    const spaceBar = this.input.keyboard.addKey("SPACE");
    spaceBar.on("down", () => {
      this.scene.start("default");
    });
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

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

window.ExternalScene = ExternalScene;
