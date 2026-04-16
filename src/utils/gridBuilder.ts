import type {
  Unit,
  SynergyData,
  GridData,
  ActivatedSynergy,
} from "../types/tft";

export const MISC_BUCKET = "Misc / Solo";

export function buildSynergyGrid(
  units: Unit[],
  synergyData: SynergyData
): GridData {
  const grid: GridData = {};
  const originNames = new Set(synergyData.origins.map((origin) => origin.name));
  const classNames = new Set(synergyData.classes.map((classData) => classData.name));

  // Initialize grid with all origin-class combinations plus a misc row/column
  synergyData.origins.forEach((origin) => {
    grid[origin.name] = {};
    synergyData.classes.forEach((className) => {
      grid[origin.name][className.name] = { champions: [] };
    });
    grid[origin.name][MISC_BUCKET] = { champions: [] };
  });
  grid[MISC_BUCKET] = {};
  synergyData.classes.forEach((classData) => {
    grid[MISC_BUCKET][classData.name] = { champions: [] };
  });
  grid[MISC_BUCKET][MISC_BUCKET] = { champions: [] };

  // Populate grid with champions
  units.forEach((unit) => {
    const origins = unit.traits.filter((trait) => originNames.has(trait));
    const classes = unit.traits.filter((trait) => classNames.has(trait));

    if (origins.length > 0 && classes.length > 0) {
      origins.forEach((origin) => {
        classes.forEach((className) => {
          grid[origin][className].champions.push(unit);
        });
      });
      return;
    }

    if (origins.length > 0) {
      origins.forEach((origin) => {
        grid[origin][MISC_BUCKET].champions.push(unit);
      });
      return;
    }

    if (classes.length > 0) {
      classes.forEach((className) => {
        grid[MISC_BUCKET][className].champions.push(unit);
      });
      return;
    }

    grid[MISC_BUCKET][MISC_BUCKET].champions.push(unit);
  });

  return grid;
}

export function getCostColorClass(cost: number): string {
  switch (cost) {
    case 1:
      return "text-gray-300"; // light gray
    case 2:
      return "text-green-400"; // green
    case 3:
      return "text-blue-400"; // blue
    case 4:
      return "text-purple-400"; // purple
    case 5:
      return "text-yellow-400"; // gold/yellow
    default:
      return "text-gray-300";
  }
}

export function getCostBackgroundClass(cost: number): string {
  switch (cost) {
    case 1:
      return "bg-gray-600"; // dark gray background
    case 2:
      return "bg-green-600"; // green background
    case 3:
      return "bg-blue-600"; // blue background
    case 4:
      return "bg-purple-600"; // purple background
    case 5:
      return "bg-yellow-600"; // gold background
    default:
      return "bg-gray-600";
  }
}

export function calculateActivatedSynergies(
  selectedChampions: Set<string>,
  units: Unit[],
  synergyData: SynergyData,
  selectedEmblems: string[]
): ActivatedSynergy[] {
  // Map of trait name to count
  const traitCounts: Record<string, number> = {};
  const activatedSynergies: ActivatedSynergy[] = [];

  // Get selected unit objects
  const selectedUnits = units.filter((unit) =>
    selectedChampions.has(unit.name)
  );

  // Helper function to identify Nomsy variants and their special trait
  const getNomsySpecialTrait = (unitName: string): string | null => {
    if (unitName === "Nomsy (Mage)") return "Mage";
    if (unitName === "Nomsy (Cannoneer)") return "Cannoneer";
    if (unitName === "Nomsy (Evoker)") return "Evoker";
    return null;
  };

  // Count trait contributions from each champion
  selectedUnits.forEach((unit) => {
    // Check if unit is a Dragon - only Dragons triple-activate origin traits
    const isDragonUnit = unit.traits.includes("Dragon");

    // Check if this is a Nomsy variant with a special trait
    const nomsySpecialTrait = getNomsySpecialTrait(unit.name);

    unit.traits.forEach((trait) => {
      const isDragon = trait === "Dragon";
      // Dragon trait always = 1, regardless of triple_trait
      if (isDragon) {
        traitCounts[trait] = (traitCounts[trait] || 0) + 1;
      } else {
        // Check if this trait is an origin or a class
        const isOriginTrait = synergyData.origins.some((o) => o.name === trait);
        // Origins get triple weight ONLY if unit is a Dragon
        // The triple_trait property is just a flag, not what triggers triple activation
        const weight = isOriginTrait && isDragonUnit ? 3 : 1;

        const baseContribution = weight;

        // If this is the special trait for a Nomsy variant, double it
        const actualContribution =
          nomsySpecialTrait === trait ? baseContribution * 2 : baseContribution;

        traitCounts[trait] = (traitCounts[trait] || 0) + actualContribution;
      }
    });
  });

  // Add emblem bonuses - each emblem gives +1 to its trait
  selectedEmblems.forEach((emblemName) => {
    traitCounts[emblemName] = (traitCounts[emblemName] || 0) + 1;
  });

  // Check all origins and classes
  const allTraits = [...synergyData.origins, ...synergyData.classes];

  allTraits.forEach((trait) => {
    const count = traitCounts[trait.name] || 0;

    if (count > 0) {
      // Determine which thresholds are activated
      const activatedThresholds: string[] = [];
      const bonuses = Object.keys(trait.bonuses).sort((a, b) => {
        // Convert "1", "2", etc. to numbers for sorting
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      });

      bonuses.forEach((threshold) => {
        const thresholdNum = parseInt(threshold);
        if (count >= thresholdNum) {
          activatedThresholds.push(threshold);
        }
      });

      if (activatedThresholds.length > 0) {
        activatedSynergies.push({
          name: trait.name,
          currentCount: count,
          activatedThresholds,
          isOrigin: synergyData.origins.some((o) => o.name === trait.name),
        });
      }
    }
  });

  return activatedSynergies;
}

export function calculateUnitCount(
  selectedChampions: Set<string>,
  units: Unit[]
): number {
  // Get selected unit objects
  const selectedUnits = units.filter((unit) =>
    selectedChampions.has(unit.name)
  );

  let totalCount = 0;
  selectedUnits.forEach((unit) => {
    // Check if unit is a Dragon - Dragons count as 2 units
    const isDragonUnit = unit.traits.includes("Dragon");
    totalCount += isDragonUnit ? 2 : 1;
  });

  return totalCount;
}
