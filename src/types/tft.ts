export interface Unit {
  name: string;
  type: string;
  traits: string[];
  triple_trait?: boolean;
  cost: number;
  ability: {
    name: string;
    mana_start: number;
    mana_max: number;
    description: string;
  };
  stats?: Record<string, string>;
}

export interface Trait {
  name: string;
  description: string;
  champions: string[];
  bonuses: Record<string, string>;
}

export interface SynergyData {
  classes: Trait[];
  origins: Trait[];
}

export interface GridCell {
  champions: Unit[];
}

export interface GridData {
  [originName: string]: {
    [className: string]: GridCell;
  };
}

export interface TooltipContent {
  type: "origin" | "class" | "champion";
  data: Trait | Unit;
}

export interface SavedTeam {
  id: string;
  name: string;
  champions: string[];
  createdAt: string;
}

export interface SavedTeamsData {
  teams: SavedTeam[];
}

export interface ActivatedSynergy {
  name: string;
  currentCount: number;
  activatedThresholds: string[];
  isOrigin: boolean;
}

export interface Composition {
  name: string;
  units: string[];
  tier: string;
  strategy: string;
}

export interface CompositionsData {
  compositions: Composition[];
}
