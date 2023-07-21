import ExternalScene from "./Scene";

export interface Clothing {
  body: string;
  hat?: string;
  hair: string;
  shirt: string;
  pants: string;
  tool?: string;
}

export interface CoasterPoint {
  x: number;
  y: number;
}

export interface Coaster {
  [key: string]: CoasterPoint;
}

export const Pedro: Clothing = {
  body: "Goblin Potion",
  hat: "Sleeping Otter",
  hair: "Buzz Cut",
  shirt: "SFL T-Shirt",
  pants: "Farmer Pants",
  tool: "Pirate Scimitar",
};

export const Witch: Clothing = {
  body: "Goblin Potion",
  hair: "White Long Hair",
  shirt: "Maiden Top",
  pants: "Farmer Pants",
  tool: "Dawn Lamp",
};

export const RolerCoaster: Coaster = {
  start: {
    x: 856,
    y: 82.5,
  },
  turn_1: {
    x: 760,
    y: 82.5,
  },
  turn_2: {
    x: 760,
    y: 130,
  },
  turn_3: {
    x: 696.5,
    y: 130,
  },
  turn_4: {
    x: 696.5,
    y: 242.5,
  },
  turn_5: {
    x: 472.5,
    y: 242.5,
  },
  turn_6: {
    x: 472.5,
    y: 290,
  },
  turn_7: {
    x: 312.5,
    y: 290,
  },
  turn_8: {
    x: 312.5,
    y: 180,
  },
  turn_9: {
    x: 471,
    y: 180,
  },
  turn_10: {
    x: 471,
    y: 18.5,
  },
  turn_11: {
    x: 952.5,
    y: 18.5,
  },
  turn_12: {
    x: 952.5,
    y: 82.5,
  },
  end: {
    x: 856,
    y: 82.5,
  },
};

declare global {
  interface Window {
    BaseScene: any;
    openModal: any;
    ExternalScene: typeof ExternalScene;
  }
}
