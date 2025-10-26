import type {
  Unit,
  SynergyData,
  GridData,
  ActivatedSynergy,
} from "../types/tft";

export function buildSynergyGrid(
  units: Unit[],
  synergyData: SynergyData
): GridData {
  const grid: GridData = {};

  // Initialize grid with all origin-class combinations
  synergyData.origins.forEach((origin) => {
    grid[origin.name] = {};
    synergyData.classes.forEach((className) => {
      grid[origin.name][className.name] = { champions: [] };
    });
  });

  // Populate grid with champions
  units.forEach((unit) => {
    unit.traits.forEach((trait) => {
      // Check if trait is an origin
      const origin = synergyData.origins.find((o) => o.name === trait);
      if (origin) {
        // Find all classes this unit has
        unit.traits.forEach((classTrait) => {
          const classData = synergyData.classes.find(
            (c) => c.name === classTrait
          );
          if (classData) {
            grid[origin.name][classData.name].champions.push(unit);
          }
        });
      }
    });
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

  // Count trait contributions from each champion
  selectedUnits.forEach((unit) => {
    // Check if unit is a Dragon - only Dragons triple-activate origin traits
    const isDragonUnit = unit.traits.includes("Dragon");

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
        traitCounts[trait] = (traitCounts[trait] || 0) + weight;
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
