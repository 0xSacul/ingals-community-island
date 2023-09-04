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

type CommunityToasts = {
  text: string;
  item?: string;
};

type CommunityModals = {
  type: "speaking" | "loading";
  messages: {
    text: string;
    actions?: { text: string; cb: () => void }[];
  }[];
};

type CommunityAPICallRecord = Record<string, number>;

interface CommunityAPICall {
  metadata: string;
  wearables?: CommunityAPICallRecord;
  items?: CommunityAPICallRecord;
}

interface CommunityAPI {
  mint: (mint: CommunityAPICall) => void;
  burn: (burn: CommunityAPICall) => void;
}

interface CommunityAPIConstructor {
  new (config: { id: string; apiKey: string }): CommunityAPI;
}

declare global {
  interface Window {
    BaseScene: any;
    createToast: (toast: CommunityToasts) => void;
    openModal: (modal: CommunityModals) => void;
    closeModal: () => void;
    CommunityAPI: CommunityAPIConstructor;
    ExternalScene: typeof ExternalScene;
  }
}
