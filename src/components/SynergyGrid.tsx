import React, { useState, useEffect } from "react";
import type {
  Unit,
  Trait,
  SynergyData,
  GridData,
  TooltipContent,
  SavedTeam,
  SavedTeamsData,
  ActivatedSynergy,
  Composition,
  CompositionsData,
} from "../types/tft";
import {
  buildSynergyGrid,
  getCostColorClass,
  calculateActivatedSynergies,
  calculateUnitCount,
} from "../utils/gridBuilder";
import { Tooltip } from "./Tooltip";
import { CustomTagInput } from "./CustomTagInput";
import emblemsData from "../assets/emblems.json";
import synergyDataRaw from "../assets/synergy_grid.json";
import unitsDataRaw from "../assets/units.json";
import compositionsDataRaw from "../assets/compositions.json";

// Unit types in order of frequency
const UNIT_TYPES = [
  "Magic Caster",
  "Magic Tank",
  "Attack Fighter",
  "Magic Fighter",
  "Attack Caster",
  "Attack Tank",
  "Attack Marksman",
  "Magic Marksman",
  "Hybrid Caster",
];

export const SynergyGrid: React.FC = () => {
  const [synergyData, setSynergyData] = useState<SynergyData | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [gridData, setGridData] = useState<GridData>({});
  const [loading, setLoading] = useState(true);
  const [hoveredChampion, setHoveredChampion] = useState<string | null>(null);
  const [hoveredOrigin, setHoveredOrigin] = useState<string | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    origin: string;
    class: string;
  } | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedCosts, setSelectedCosts] = useState<Set<number>>(new Set());
  const [selectedChampions, setSelectedChampions] = useState<Set<string>>(
    new Set()
  );
  const [selectedChampionTags, setSelectedChampionTags] = useState<
    Array<{ id: string; text: string; className: string; cost?: number }>
  >([]);
  const [selectedOrigins, setSelectedOrigins] = useState<Set<string>>(
    new Set()
  );
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set()
  );
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [activatedSynergies, setActivatedSynergies] = useState<
    ActivatedSynergy[]
  >([]);
  const [unitCount, setUnitCount] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<
    Array<{ id: string; text: string; className: string }>
  >([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedEmblems, setSelectedEmblems] = useState<string[]>([]);
  const [selectedEmblemTags, setSelectedEmblemTags] = useState<
    Array<{ id: string; text: string; className: string }>
  >([]);
  const [teamNameSearch, setTeamNameSearch] = useState<string>("");
  const [championFilterTags, setChampionFilterTags] = useState<
    Array<{ id: string; text: string; className: string }>
  >([]);
  const [championFilterInput, setChampionFilterInput] = useState<string>("");
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [compositionNameSearch, setCompositionNameSearch] =
    useState<string>("");
  const [compositionFilterTags, setCompositionFilterTags] = useState<
    Array<{ id: string; text: string; className: string }>
  >([]);
  const [compositionFilterInput, setCompositionFilterInput] =
    useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setSynergyData(synergyDataRaw as unknown as SynergyData);
        setUnits(unitsDataRaw.units as unknown as Unit[]);
        setGridData(
          buildSynergyGrid(
            unitsDataRaw.units as unknown as Unit[],
            synergyDataRaw as unknown as SynergyData
          )
        );

        // Create suggestions array for autocomplete (will be updated when champions are selected)
        const championSuggestions = (
          unitsDataRaw.units as unknown as Unit[]
        ).map((unit: Unit, index: number) => ({
          id: index.toString(),
          text: unit.name,
          className: "",
        }));
        setSuggestions(championSuggestions);

        // Load saved teams from localStorage
        try {
          const savedTeamsData = localStorage.getItem("savedTeams");
          if (savedTeamsData) {
            const parsed = JSON.parse(savedTeamsData);
            setSavedTeams(parsed.teams || []);
          }
        } catch (error) {
          console.error("Error loading saved teams from localStorage:", error);
        }

        // Load compositions
        try {
          const parsed = compositionsDataRaw as unknown as CompositionsData;
          setCompositions(parsed.compositions || []);
        } catch (error) {
          console.error("Error loading compositions:", error);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (synergyData && units.length > 0) {
      const activated = calculateActivatedSynergies(
        selectedChampions,
        units,
        synergyData,
        selectedEmblems
      );
      setActivatedSynergies(activated);

      const count = calculateUnitCount(selectedChampions, units);
      setUnitCount(count);
    }
  }, [synergyData, units, selectedChampions, selectedEmblems]);

  // Update suggestions to include all champions (with selection status)
  useEffect(() => {
    if (units.length > 0) {
      const allChampions = units.map((unit: Unit, index: number) => ({
        id: `suggestion-${index}`, // Use different ID prefix to avoid filtering
        text: unit.name,
        className: selectedChampions.has(unit.name) ? "selected" : "",
      }));
      setSuggestions(allChampions);
    }
  }, [units, selectedChampions]);

  // Champion filter suggestions (excluding already selected filter champions)
  const championFilterSuggestions = units
    .filter((unit) => !championFilterTags.some((tag) => tag.text === unit.name))
    .map((unit, index) => ({
      id: `filter-suggestion-${index}`,
      text: unit.name,
      className: "",
    }));

  // Composition filter suggestions (excluding already selected filter champions)
  const compositionFilterSuggestions = units
    .filter(
      (unit) => !compositionFilterTags.some((tag) => tag.text === unit.name)
    )
    .map((unit, index) => ({
      id: `comp-filter-suggestion-${index}`,
      text: unit.name,
      className: "",
    }));

  // Save current team to saved teams
  const saveCurrentTeam = (teamName: string) => {
    if (!teamName.trim()) return;

    const newTeam: SavedTeam = {
      id: Date.now().toString(),
      name: teamName.trim(),
      champions: Array.from(selectedChampions),
      createdAt: new Date().toISOString(),
    };

    const updatedTeams = [...savedTeams, newTeam];
    setSavedTeams(updatedTeams);

    try {
      const savedTeamsData: SavedTeamsData = { teams: updatedTeams };
      localStorage.setItem("savedTeams", JSON.stringify(savedTeamsData));
    } catch (error) {
      console.error("Error saving team to localStorage:", error);
    }
  };

  // Load a saved team
  const loadTeam = (team: SavedTeam) => {
    const newSelectedChampions = new Set(team.champions);
    setSelectedChampions(newSelectedChampions);
    setSelectedChampionTags(
      team.champions.map((name, index) => {
        const champion = units.find((unit) => unit.name === name);
        return {
          id: index.toString(),
          text: name,
          className: getTagBackgroundClass(champion?.cost || 1),
          cost: champion?.cost || 1,
        };
      })
    );
  };

  // Delete a saved team
  const deleteTeam = (teamId: string) => {
    const updatedTeams = savedTeams.filter((team) => team.id !== teamId);
    setSavedTeams(updatedTeams);

    try {
      const savedTeamsData: SavedTeamsData = { teams: updatedTeams };
      localStorage.setItem("savedTeams", JSON.stringify(savedTeamsData));
    } catch (error) {
      console.error("Error deleting team from localStorage:", error);
    }
  };

  // Load a composition
  const loadComposition = (composition: Composition) => {
    // Clear existing selections
    setSelectedChampions(new Set());
    setSelectedChampionTags([]);
    setSelectedEmblems([]);
    setSelectedEmblemTags([]);

    // Create a Set from composition units
    const newSelectedChampions = new Set<string>();
    const newSelectedChampionTags: Array<{
      id: string;
      text: string;
      className: string;
      cost?: number;
    }> = [];

    composition.units.forEach((unitName, index) => {
      const champion = units.find(
        (unit) =>
          unit.name === unitName ||
          unit.name.toLowerCase() === unitName.toLowerCase()
      );

      if (champion) {
        newSelectedChampions.add(champion.name);
        newSelectedChampionTags.push({
          id: index.toString(),
          text: champion.name,
          className: getTagBackgroundClass(champion.cost),
          cost: champion.cost,
        });
      }
    });

    setSelectedChampions(newSelectedChampions);
    setSelectedChampionTags(newSelectedChampionTags);
  };

  // Helper function to get cost-based background color for tags
  const getTagBackgroundClass = (cost: number): string => {
    switch (cost) {
      case 1:
        return "bg-gray-600"; // gray background
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
  };

  // Helper function to identify Nomsy variants
  const isNomsyVariant = (name: string): boolean => {
    return name.startsWith("Nomsy (");
  };

  // React-tag-input handlers
  const handleTagAddition = (tag: any) => {
    // Check if this is a valid champion name
    const knownChampion = units.find(
      (unit) => unit.name.toLowerCase() === tag.text.toLowerCase()
    );

    if (!knownChampion) {
      // Reject invalid champion names - keep text in input
      console.warn(`"${tag.text}" is not a valid champion name`);
      setInputValue(tag.text); // Keep the invalid text in input
      return;
    }

    // Check for duplicates
    if (selectedChampions.has(knownChampion.name)) {
      console.warn(`"${knownChampion.name}" is already selected`);
      setInputValue(tag.text); // Keep the duplicate text in input
      return;
    }

    // Use the exact champion name from data
    const standardizedText = knownChampion.name;

    const newChampions = new Set(selectedChampions);

    // Handle Nomsy mutual exclusivity: if adding a Nomsy variant, remove any other Nomsy variants
    if (isNomsyVariant(standardizedText)) {
      // Remove any existing Nomsy variants
      Array.from(newChampions).forEach((championName) => {
        if (isNomsyVariant(championName)) {
          newChampions.delete(championName);
        }
      });
    }

    newChampions.add(standardizedText);
    setSelectedChampions(newChampions);

    // Update tags to exclude other Nomsy variants and only add if not already present
    const updatedTags = selectedChampionTags.filter((tagItem) =>
      newChampions.has(tagItem.text)
    );

    // Only add the new tag if it doesn't already exist
    if (!updatedTags.some((tagItem) => tagItem.text === standardizedText)) {
      updatedTags.push({
        id: tag.id,
        text: standardizedText,
        className: getTagBackgroundClass(knownChampion.cost),
        cost: knownChampion.cost,
      });
    }

    setSelectedChampionTags(updatedTags);

    // Clear input only on successful addition
    setInputValue("");
  };

  const handleInputChange = (input: string) => {
    setInputValue(input);
  };

  const handleTagDeletion = (i: number) => {
    const tagToRemove = selectedChampionTags[i];
    const newChampions = new Set(selectedChampions);
    newChampions.delete(tagToRemove.text);
    setSelectedChampions(newChampions);
    setSelectedChampionTags(
      selectedChampionTags.filter((_, index) => index !== i)
    );
  };

  // Emblem handlers
  const [emblemInputValue, setEmblemInputValue] = useState<string>("");

  const handleEmblemAddition = (tag: any) => {
    const emblemName = tag.text;

    // Check if this is a valid emblem
    const isValidEmblem = emblemsData.includes(emblemName);
    if (!isValidEmblem) {
      console.warn(`"${emblemName}" is not a valid emblem name`);
      setEmblemInputValue(emblemName);
      return;
    }

    // Allow multiple emblems of the same kind - no duplicate check
    const newEmblems = [...selectedEmblems, emblemName];
    setSelectedEmblems(newEmblems);

    const updatedTags = [...selectedEmblemTags];
    updatedTags.push({
      id: `${tag.id}-${Date.now()}`, // Make unique ID for duplicates
      text: emblemName,
      className: "bg-gray-600", // Changed from purple to neutral gray
    });
    setSelectedEmblemTags(updatedTags);
    setEmblemInputValue("");
  };

  const handleEmblemInputChange = (input: string) => {
    setEmblemInputValue(input);
  };

  const handleEmblemDeletion = (i: number) => {
    const tagToRemove = selectedEmblemTags[i];
    const newEmblems = selectedEmblems.filter((_, index) => {
      // Find the first occurrence of this emblem name and remove it
      const emblemIndex = selectedEmblems.indexOf(tagToRemove.text);
      return index !== emblemIndex;
    });
    setSelectedEmblems(newEmblems);
    setSelectedEmblemTags(selectedEmblemTags.filter((_, index) => index !== i));
  };

  // Filter saved teams based on team name and champion filters
  const filteredSavedTeams = savedTeams.filter((team) => {
    // Team name filter (only if not empty)
    const matchesTeamName =
      teamNameSearch.trim() === "" ||
      team.name.toLowerCase().includes(teamNameSearch.toLowerCase());

    // Champion filter (only if not empty)
    const matchesChampions =
      championFilterTags.length === 0 ||
      championFilterTags.every((filterTag) =>
        team.champions.includes(filterTag.text)
      );

    return matchesTeamName && matchesChampions;
  });

  // Filter compositions based on name and champion filters
  const filteredCompositions = compositions.filter((composition) => {
    // Composition name filter (only if not empty)
    const matchesName =
      compositionNameSearch.trim() === "" ||
      composition.name
        .toLowerCase()
        .includes(compositionNameSearch.toLowerCase());

    // Champion filter (only if not empty)
    const matchesChampions =
      compositionFilterTags.length === 0 ||
      compositionFilterTags.every((filterTag) =>
        composition.units.includes(filterTag.text)
      );

    return matchesName && matchesChampions;
  });

  // Champion filter handlers
  const handleChampionFilterAddition = (tag: any) => {
    // Check if this is a valid champion name
    const knownChampion = units.find(
      (unit) => unit.name.toLowerCase() === tag.text.toLowerCase()
    );

    if (!knownChampion) {
      // Reject invalid champion names - keep text in input
      console.warn(`"${tag.text}" is not a valid champion name`);
      setChampionFilterInput(tag.text);
      return;
    }

    // Check for duplicates
    if (
      championFilterTags.some(
        (filterTag) => filterTag.text === knownChampion.name
      )
    ) {
      console.warn(`"${knownChampion.name}" is already in the filter`);
      setChampionFilterInput(tag.text);
      return;
    }

    // Use the exact champion name from data
    const standardizedText = knownChampion.name;

    const updatedTags = [
      ...championFilterTags,
      {
        id: tag.id,
        text: standardizedText,
        className: "bg-gray-600",
      },
    ];
    setChampionFilterTags(updatedTags);
    setChampionFilterInput("");
  };

  const handleChampionFilterInputChange = (input: string) => {
    setChampionFilterInput(input);
  };

  const handleChampionFilterDeletion = (i: number) => {
    setChampionFilterTags(championFilterTags.filter((_, index) => index !== i));
  };

  // Composition filter handlers
  const handleCompositionFilterAddition = (tag: any) => {
    // Check if this is a valid champion name
    const knownChampion = units.find(
      (unit) => unit.name.toLowerCase() === tag.text.toLowerCase()
    );

    if (!knownChampion) {
      // Reject invalid champion names - keep text in input
      console.warn(`"${tag.text}" is not a valid champion name`);
      setCompositionFilterInput(tag.text);
      return;
    }

    // Check for duplicates
    if (
      compositionFilterTags.some(
        (filterTag) => filterTag.text === knownChampion.name
      )
    ) {
      console.warn(`"${knownChampion.name}" is already in the filter`);
      setCompositionFilterInput(tag.text);
      return;
    }

    // Use the exact champion name from data
    const standardizedText = knownChampion.name;

    const updatedTags = [
      ...compositionFilterTags,
      {
        id: tag.id,
        text: standardizedText,
        className: "bg-gray-600",
      },
    ];
    setCompositionFilterTags(updatedTags);
    setCompositionFilterInput("");
  };

  const handleCompositionFilterInputChange = (input: string) => {
    setCompositionFilterInput(input);
  };

  const handleCompositionFilterDeletion = (i: number) => {
    setCompositionFilterTags(
      compositionFilterTags.filter((_, index) => index !== i)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-800">
        <div className="text-white text-xl">Loading synergy grid...</div>
      </div>
    );
  }

  if (!synergyData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-800">
        <div className="text-red-400 text-xl">Failed to load data</div>
      </div>
    );
  }

  const renderChampion = (champion: Unit) => {
    const tooltipContent: TooltipContent = {
      type: "champion",
      data: champion,
    };

    // Check if champion has triple_trait property (TRIPLE indicator)
    const isTriple = champion.triple_trait === true;

    // Check if this champion is currently being hovered
    const isHovered = hoveredChampion === champion.name;

    // Check if champion matches the filter criteria (AND logic for cost + type)
    const hasTypeFilter = selectedTypes.size > 0;
    const hasCostFilter = selectedCosts.size > 0;

    let isFilterSelected = false;
    if (hasTypeFilter && hasCostFilter) {
      // Both filters active: champion must match BOTH type AND cost
      isFilterSelected =
        selectedTypes.has(champion.type) && selectedCosts.has(champion.cost);
    } else if (hasTypeFilter) {
      // Only type filter active
      isFilterSelected = selectedTypes.has(champion.type);
    } else if (hasCostFilter) {
      // Only cost filter active
      isFilterSelected = selectedCosts.has(champion.cost);
    }

    // Check if champion is selected
    const isChampionSelected = selectedChampions.has(champion.name);

    // Apply different borders based on selection type
    let borderClass = "";
    let boxShadowClass = "";
    if (isFilterSelected && isChampionSelected) {
      // Both borders when selected by both methods - use box-shadow for outer border
      borderClass = "border-2 border-white";
      boxShadowClass = "shadow-[0_0_0_2px_rgba(96,165,250,1)]"; // Blue outer border using box-shadow
    } else if (isFilterSelected) {
      // Blue border for filter
      borderClass = "border-2 border-blue-400";
    } else if (isChampionSelected) {
      // White border for selected champions
      borderClass = "border-2 border-white";
    }

    const handleChampionClick = () => {
      const newSelectedChampions = new Set(selectedChampions);
      if (isChampionSelected) {
        newSelectedChampions.delete(champion.name);
        setSelectedChampionTags(
          selectedChampionTags.filter((tag) => tag.text !== champion.name)
        );
      } else {
        // Handle Nomsy mutual exclusivity: if adding a Nomsy variant, remove any other Nomsy variants
        if (isNomsyVariant(champion.name)) {
          // Remove any existing Nomsy variants
          Array.from(newSelectedChampions).forEach((championName) => {
            if (isNomsyVariant(championName)) {
              newSelectedChampions.delete(championName);
            }
          });
        }

        newSelectedChampions.add(champion.name);

        // Update tags to match the updated champions set
        const updatedTags = selectedChampionTags.filter((tag) =>
          newSelectedChampions.has(tag.text)
        );

        // Only add tag if it doesn't already exist
        if (!updatedTags.some((tag) => tag.text === champion.name)) {
          const newTag = {
            id: Date.now().toString(),
            text: champion.name,
            className: getTagBackgroundClass(champion.cost),
            cost: champion.cost,
          };
          updatedTags.push(newTag);
        }

        setSelectedChampionTags(updatedTags);
      }
      setSelectedChampions(newSelectedChampions);
    };

    return (
      <Tooltip
        key={champion.name}
        content={tooltipContent}
        onMouseEnter={() => setHoveredChampion(champion.name)}
        onMouseLeave={() => setHoveredChampion(null)}
      >
        <div
          className={`text-xs font-medium ${getCostColorClass(champion.cost)} ${
            isHovered ? "underline" : "hover:underline"
          } cursor-pointer rounded-md px-2 py-1 ${borderClass} ${boxShadowClass}`}
          onClick={(e) => {
            e.stopPropagation();
            handleChampionClick();
          }}
        >
          <span className="inline-flex items-center gap-1">
            <span className="truncate">{champion.name}</span>
            {isTriple && <span className="text-yellow-400 font-bold">*</span>}
          </span>
        </div>
      </Tooltip>
    );
  };

  const renderOriginTooltip = (origin: Trait) => {
    const tooltipContent: TooltipContent = {
      type: "origin",
      data: origin,
    };

    const isActivated = activatedSynergies.some(
      (s) => s.name === origin.name && s.isOrigin
    );

    // Check if this trait has an emblem applied
    const emblemCount = selectedEmblems.filter((e) => e === origin.name).length;
    const hasEmblem = emblemCount > 0;

    return (
      <Tooltip content={tooltipContent} activatedSynergies={activatedSynergies}>
        <div className="text-white font-semibold text-xs truncate relative">
          {origin.name}
          {hasEmblem && (
            <span className="text-gray-300 font-bold"> (+{emblemCount})</span>
          )}
          {isActivated && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
          )}
        </div>
      </Tooltip>
    );
  };

  const renderClassTooltip = (classData: Trait) => {
    const tooltipContent: TooltipContent = {
      type: "class",
      data: classData,
    };

    const isActivated = activatedSynergies.some(
      (s) => s.name === classData.name && !s.isOrigin
    );

    // Check if this trait has an emblem applied
    const emblemCount = selectedEmblems.filter(
      (e) => e === classData.name
    ).length;
    const hasEmblem = emblemCount > 0;

    return (
      <Tooltip content={tooltipContent} activatedSynergies={activatedSynergies}>
        <div className="text-white font-semibold text-xs truncate relative">
          {classData.name}
          {hasEmblem && (
            <span className="text-gray-300 font-bold"> (+{emblemCount})</span>
          )}
          {isActivated && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
          )}
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="min-h-screen bg-slate-800 px-8 pt-4 pb-8 flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-4 text-center">
        TFT Set Revival 7.5 Synergy Grid
      </h1>

      <div className="bg-slate-700 rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-xs min-w-max">
            {/* Header Row */}
            <thead>
              <tr className="bg-slate-600">
                <th className="w-20 p-1 border border-slate-500 text-xs"></th>
                {synergyData.origins.map((origin) => {
                  const isOriginActivated = activatedSynergies.some(
                    (s) => s.name === origin.name && s.isOrigin
                  );
                  const isColumnSelected = selectedOrigins.has(origin.name);

                  const handleColumnClick = () => {
                    const newSelectedOrigins = new Set(selectedOrigins);
                    if (isColumnSelected) {
                      newSelectedOrigins.delete(origin.name);
                    } else {
                      newSelectedOrigins.add(origin.name);
                    }
                    setSelectedOrigins(newSelectedOrigins);
                  };

                  return (
                    <th
                      key={origin.name}
                      className={`cursor-pointer p-1 border border-slate-500 text-center min-w-24 transition-colors ${
                        hoveredOrigin === origin.name ? "bg-slate-500" : ""
                      } ${isColumnSelected ? "bg-blue-900/30" : ""} ${
                        isOriginActivated ? "bg-green-900/20" : ""
                      }`}
                      onMouseEnter={() => setHoveredOrigin(origin.name)}
                      onMouseLeave={() => setHoveredOrigin(null)}
                      onClick={handleColumnClick}
                      style={
                        isColumnSelected && isOriginActivated
                          ? {
                              background:
                                "linear-gradient(to right, rgba(22, 78, 99, 0.3) 0%, rgba(22, 78, 99, 0.3) 100%), linear-gradient(to right, rgba(20, 83, 45, 0.2) 0%, rgba(20, 83, 45, 0.2) 100%)",
                            }
                          : {}
                      }
                    >
                      {renderOriginTooltip(origin)}
                      <div className="text-xs text-gray-300 mt-1 truncate">
                        {Object.keys(origin.bonuses).join("/")}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {synergyData.classes.map((classData) => {
                const isRowSelected = selectedClasses.has(classData.name);
                const isRowHovered = hoveredClass === classData.name;

                const handleRowClick = () => {
                  const newSelectedClasses = new Set(selectedClasses);
                  if (isRowSelected) {
                    newSelectedClasses.delete(classData.name);
                  } else {
                    newSelectedClasses.add(classData.name);
                  }
                  setSelectedClasses(newSelectedClasses);
                };

                return (
                  <tr
                    key={classData.name}
                    className={`${
                      isRowHovered ? "bg-slate-600" : "hover:bg-slate-600/50"
                    } ${isRowSelected ? "bg-blue-900/30" : ""}`}
                    onMouseEnter={() => setHoveredClass(classData.name)}
                    onMouseLeave={() => setHoveredClass(null)}
                  >
                    <td
                      className={`cursor-pointer p-1 border border-slate-500 ${
                        activatedSynergies.some(
                          (s) => s.name === classData.name && !s.isOrigin
                        )
                          ? "bg-green-900/20"
                          : "bg-slate-600"
                      }`}
                      onClick={handleRowClick}
                    >
                      <div className="text-center">
                        {renderClassTooltip(classData)}
                        <div className="text-xs text-gray-300 mt-1 truncate">
                          {Object.keys(classData.bonuses).join("/")}
                        </div>
                      </div>
                    </td>
                    {synergyData.origins.map((origin) => {
                      const cell = gridData[origin.name]?.[classData.name];
                      const champions = cell?.champions || [];
                      const isColumnSelected = selectedOrigins.has(origin.name);
                      const isColumnHovered =
                        hoveredOrigin === origin.name ||
                        (hoveredCell && hoveredCell.origin === origin.name);
                      const isRowHovered =
                        hoveredClass === classData.name ||
                        (hoveredCell && hoveredCell.class === classData.name);
                      const isCellHighlighted =
                        isRowSelected || isColumnSelected;
                      const isCellHovered = isRowHovered || isColumnHovered;
                      const isCurrentCellHovered =
                        hoveredCell &&
                        hoveredCell.origin === origin.name &&
                        hoveredCell.class === classData.name;

                      // Determine background color based on state
                      let cellBgClass = "";
                      if (isCurrentCellHovered) {
                        // Current cell is being hovered
                        if (isCellHighlighted) {
                          // Cell is selected and hovered - use intermediate color
                          cellBgClass = "bg-blue-700/40";
                        } else {
                          // Cell is not selected but hovered - use grey
                          cellBgClass = "bg-slate-600";
                        }
                      } else if (isCellHovered) {
                        // Row or column is being hovered
                        if (isCellHighlighted) {
                          // Cell is selected and row/column is hovered - use intermediate color
                          cellBgClass = "bg-blue-700/40";
                        } else {
                          // Cell is not selected but row/column is hovered - use grey
                          cellBgClass = "bg-slate-600";
                        }
                      } else if (isCellHighlighted) {
                        // Cell is selected but not hovered
                        cellBgClass = "bg-blue-900/30";
                      }

                      return (
                        <td
                          key={`${origin.name}-${classData.name}`}
                          className={`p-1 border border-slate-500 min-w-24 ${cellBgClass}`}
                          onMouseEnter={() =>
                            setHoveredCell({
                              origin: origin.name,
                              class: classData.name,
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div className="flex flex-col space-y-0.5 min-h-[20px]">
                            {champions.map((champion) =>
                              renderChampion(champion)
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Activated Synergies Section */}
        <div className="mt-2 bg-slate-700 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-semibold text-sm">
              Activated Synergies
            </h3>
            <span className="text-gray-300 text-sm">
              (unit count: {unitCount})
            </span>
          </div>
          {activatedSynergies.length > 0 ? (
            <div className="space-y-2">
              {activatedSynergies.map((synergy) => {
                const trait = [
                  ...(synergyData?.origins || []),
                  ...(synergyData?.classes || []),
                ].find((t) => t.name === synergy.name);
                const highestThreshold =
                  synergy.activatedThresholds[
                    synergy.activatedThresholds.length - 1
                  ];
                const bonusText = trait?.bonuses[highestThreshold] || "";

                // Calculate current tier and next tier
                const thresholds = Object.keys(trait?.bonuses || {})
                  .map(Number)
                  .sort((a, b) => a - b);
                const currentTier = parseInt(highestThreshold) || 0;
                const currentTierIndex = thresholds.indexOf(currentTier);
                const nextTier =
                  currentTierIndex >= 0 &&
                  currentTierIndex < thresholds.length - 1
                    ? thresholds[currentTierIndex + 1]
                    : currentTier; // Use current tier if it's the final tier

                return (
                  <div
                    key={synergy.name}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      synergy.isOrigin ? "bg-orange-900/30" : "bg-blue-900/30"
                    }`}
                  >
                    <span className="font-semibold text-white text-sm">
                      {synergy.name}
                    </span>
                    <span className="text-gray-300 text-sm">
                      ({synergy.currentCount})
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({currentTier}/{nextTier})
                    </span>
                    {bonusText && (
                      <>
                        <span className="text-gray-400">:</span>
                        <span className="text-green-300 text-sm">
                          {bonusText}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-gray-400">
              No synergies activated. Select champions to activate synergies.
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-2 bg-slate-700 rounded-lg p-2">
          <h3 className="text-white font-semibold mb-2 text-sm">Cost Legend</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-300">1:</span>
              <span className="text-gray-300">Gray</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">2:</span>
              <span className="text-white">Green</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-400">3:</span>
              <span className="text-white">Blue</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-purple-400">4:</span>
              <span className="text-white">Purple</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">5:</span>
              <span className="text-white">Gold</span>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <span className="text-xs font-bold text-gray-300">Name*</span>
              <span className="text-gray-300">= 3 traits</span>
            </div>
          </div>
        </div>

        {/* Type Filter Bar */}
        <div className="mt-2 bg-slate-700 rounded-lg p-2">
          <h3 className="text-white font-semibold mb-2 text-sm">
            Filter by Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.size > 0 && (
              <button
                onClick={() => setSelectedTypes(new Set())}
                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                Clear Filters
              </button>
            )}
            {UNIT_TYPES.map((type) => {
              const isSelected = selectedTypes.has(type);
              // Get unique units by type (avoid double counting from grid cells)
              const uniqueUnitsByType = new Set(
                Object.values(gridData)
                  .flatMap((origin) =>
                    Object.values(origin).flatMap((cell) =>
                      cell.champions.filter(
                        (champion) => champion.type === type
                      )
                    )
                  )
                  .map((champion) => champion.name)
              );
              const count = uniqueUnitsByType.size;

              return (
                <button
                  key={type}
                  onClick={() => {
                    const newSelectedTypes = new Set(selectedTypes);
                    if (isSelected) {
                      newSelectedTypes.delete(type);
                    } else {
                      newSelectedTypes.add(type);
                    }
                    setSelectedTypes(newSelectedTypes);
                  }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    isSelected
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-slate-600 hover:bg-slate-500 text-gray-300"
                  }`}
                >
                  {type} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Cost Filter Bar */}
        <div className="mt-2 bg-slate-700 rounded-lg p-2">
          <h3 className="text-white font-semibold mb-2 text-sm">
            Filter by Cost
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedCosts.size > 0 && (
              <button
                onClick={() => setSelectedCosts(new Set())}
                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                Clear Filters
              </button>
            )}
            {[1, 2, 3, 4, 5].map((cost) => {
              const isSelected = selectedCosts.has(cost);
              // Get unique units by cost (avoid double counting from grid cells)
              const uniqueUnitsByCost = new Set(
                Object.values(gridData)
                  .flatMap((origin) =>
                    Object.values(origin).flatMap((cell) =>
                      cell.champions.filter(
                        (champion) => champion.cost === cost
                      )
                    )
                  )
                  .map((champion) => champion.name)
              );
              const count = uniqueUnitsByCost.size;

              return (
                <button
                  key={cost}
                  onClick={() => {
                    const newSelectedCosts = new Set(selectedCosts);
                    if (isSelected) {
                      newSelectedCosts.delete(cost);
                    } else {
                      newSelectedCosts.add(cost);
                    }
                    setSelectedCosts(newSelectedCosts);
                  }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    isSelected
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-slate-600 hover:bg-slate-500 text-gray-300"
                  }`}
                >
                  {cost} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Row/Column Selection Bar */}
        <div className="mt-2 bg-slate-700 rounded-lg p-2">
          <h3 className="text-white font-semibold mb-2 text-sm">
            Row/Column Selection
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            {(selectedOrigins.size > 0 || selectedClasses.size > 0) && (
              <button
                onClick={() => {
                  setSelectedOrigins(new Set());
                  setSelectedClasses(new Set());
                }}
                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                Clear Row/Column Selection
              </button>
            )}
            <div className="text-xs text-gray-300">
              Click on any cell in an origin column or class row to highlight
              them
            </div>
          </div>
        </div>

        {/* Champion Selection Bar */}
        <div className="mt-2 bg-slate-700 rounded-lg p-2">
          <h3 className="text-white font-semibold mb-2 text-sm">
            Selected Champions
          </h3>
          {selectedChampions.size > 0 && (
            <button
              onClick={() => {
                setSelectedChampions(new Set());
                setSelectedChampionTags([]);
              }}
              className="mb-2 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              Clear Selection
            </button>
          )}
          <CustomTagInput
            tags={selectedChampionTags}
            suggestions={suggestions}
            onAdd={handleTagAddition}
            onDelete={handleTagDeletion}
            inputValue={inputValue}
            onInputChange={handleInputChange}
          />

          {/* Save Team Section */}
          {selectedChampions.size > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {!showSaveDialog ? (
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                >
                  Save Current Team
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Team name..."
                    className="px-2 py-1 text-xs bg-slate-600 text-white border border-slate-500 rounded focus:outline-none focus:border-green-400"
                  />
                  <button
                    onClick={() => {
                      saveCurrentTeam(newTeamName);
                      setNewTeamName("");
                      setShowSaveDialog(false);
                    }}
                    disabled={!newTeamName.trim()}
                    className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setNewTeamName("");
                      setShowSaveDialog(false);
                    }}
                    className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Emblems Section */}
        <div className="mt-2 bg-slate-700 rounded-lg p-2">
          <h3 className="text-white font-semibold mb-2 text-sm">
            Selected Emblems
          </h3>
          {selectedEmblems.length > 0 && (
            <button
              onClick={() => {
                setSelectedEmblems([]);
                setSelectedEmblemTags([]);
              }}
              className="mb-2 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              Clear Emblems
            </button>
          )}
          <CustomTagInput
            tags={selectedEmblemTags}
            suggestions={emblemsData.map((emblem, index) => ({
              id: `emblem-${index}`,
              text: emblem,
              className: "",
            }))}
            onAdd={handleEmblemAddition}
            onDelete={handleEmblemDeletion}
            inputValue={emblemInputValue}
            onInputChange={handleEmblemInputChange}
          />
        </div>

        {/* Recommended Compositions Section */}
        <div className="mt-2 mb-16 bg-slate-700 rounded-lg p-2">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">
                Recommended Compositions ({filteredCompositions.length}/
                {compositions.length})
              </h3>
              <input
                type="text"
                value={compositionNameSearch}
                onChange={(e) => setCompositionNameSearch(e.target.value)}
                placeholder="Search composition name..."
                className="px-2 py-1 text-xs bg-slate-600 text-white border border-slate-500 rounded focus:outline-none focus:border-blue-400 w-48"
              />
            </div>
            {(compositionNameSearch || compositionFilterTags.length > 0) && (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setCompositionNameSearch("");
                    setCompositionFilterTags([]);
                  }}
                  className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Composition Champion Filter */}
          <div className="mb-2">
            <CustomTagInput
              tags={compositionFilterTags}
              suggestions={compositionFilterSuggestions}
              onAdd={handleCompositionFilterAddition}
              onDelete={handleCompositionFilterDeletion}
              inputValue={compositionFilterInput}
              onInputChange={handleCompositionFilterInputChange}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {compositions.length > 0 ? (
              filteredCompositions.length > 0 ? (
                filteredCompositions.map((composition) => {
                  const tierColorClass =
                    composition.tier === "S"
                      ? "bg-amber-600"
                      : "bg-emerald-600";
                  const hoverColorClass =
                    composition.tier === "S"
                      ? "hover:bg-amber-700"
                      : "hover:bg-emerald-700";

                  return (
                    <div key={composition.name} className="relative group">
                      <button
                        onClick={() => loadComposition(composition)}
                        className={`px-3 py-1 text-xs ${tierColorClass} ${hoverColorClass} text-white rounded-full transition-colors`}
                        title={`Click to load this composition`}
                      >
                        {composition.name} ({composition.tier}) -{" "}
                        {composition.units.length} units
                      </button>
                      <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 border border-gray-500 rounded-lg p-3 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                        <div className="space-y-1">
                          <div className="font-bold text-white text-sm">
                            {composition.name}
                          </div>
                          <div className="text-gray-300 text-xs">
                            Strategy: {composition.strategy}
                          </div>
                          <div className="text-gray-300 text-xs">
                            Tier: {composition.tier}
                          </div>
                          <div className="text-gray-400 text-xs pt-1 border-t border-gray-600">
                            Units: {composition.units.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-gray-400">
                  No compositions match the current filters.
                </div>
              )
            ) : (
              <div className="text-xs text-gray-400">
                No recommended compositions available.
              </div>
            )}
          </div>
        </div>

        {/* Saved Teams Section */}
        <div className="mt-2 mb-16 bg-slate-700 rounded-lg p-2">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">
                Saved Teams ({filteredSavedTeams.length}/{savedTeams.length})
              </h3>
              <input
                type="text"
                value={teamNameSearch}
                onChange={(e) => setTeamNameSearch(e.target.value)}
                placeholder="Search team name..."
                className="px-2 py-1 text-xs bg-slate-600 text-white border border-slate-500 rounded focus:outline-none focus:border-blue-400 w-48"
              />
            </div>
            {(teamNameSearch || championFilterTags.length > 0) && (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setTeamNameSearch("");
                    setChampionFilterTags([]);
                  }}
                  className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Champion Filter */}
          <div className="mb-2">
            <CustomTagInput
              tags={championFilterTags}
              suggestions={championFilterSuggestions}
              onAdd={handleChampionFilterAddition}
              onDelete={handleChampionFilterDeletion}
              inputValue={championFilterInput}
              onInputChange={handleChampionFilterInputChange}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {savedTeams.length > 0 ? (
              filteredSavedTeams.length > 0 ? (
                filteredSavedTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-colors group"
                  >
                    <button
                      onClick={() => loadTeam(team)}
                      className="px-3 py-1 text-xs hover:bg-teal-700 rounded-l-full transition-colors"
                    >
                      {team.name} ({team.champions.length})
                    </button>
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-r-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">
                  No teams match the current filters.
                </div>
              )
            ) : (
              <div className="text-xs text-gray-400">
                No saved teams yet. Select champions and save a team to get
                started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
