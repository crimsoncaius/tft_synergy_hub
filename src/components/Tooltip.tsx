import React, { useState, useRef } from "react";
import type { TooltipContent, Unit, Trait } from "../types/tft";
import type { ActivatedSynergy } from "../types/tft";

// Helper function to get cost-based color class
const getCostColorClass = (cost: number): string => {
  switch (cost) {
    case 1:
      return "bg-gray-600";
    case 2:
      return "bg-green-600";
    case 3:
      return "bg-blue-600";
    case 4:
      return "bg-purple-600";
    case 5:
      return "bg-yellow-600";
    default:
      return "bg-gray-600";
  }
};

// Helper function to highlight damage values in text
const highlightDamageValues = (text: string): React.ReactNode[] => {
  // Split text by regex pattern to capture damage values (number/number/number) and stat indicators
  // The pattern matches: (AD), (AP), \d+/\d+/\d+, and individual AD/AP words (but with parentheses handling)
  const parts = text.split(/(\(AD\))|(\(AP\))|(\d+\/\d+\/\d+)/g);

  return parts
    .filter((part) => part !== undefined)
    .map((part, index) => {
      // Check if this part matches damage values (e.g., "200/300/900")
      if (part && /^\d+\/\d+\/\d+$/.test(part)) {
        return (
          <span key={index} className="text-orange-400 font-semibold">
            {part}
          </span>
        );
      }
      // Check if this part is (AD)
      if (part === "(AD)") {
        return (
          <span key={index} className="text-red-400 font-semibold">
            (AD)
          </span>
        );
      }
      // Check if this part is (AP)
      if (part === "(AP)") {
        return (
          <span key={index} className="text-blue-400 font-semibold">
            (AP)
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
};

interface TooltipProps {
  content: TooltipContent;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  activatedSynergies?: ActivatedSynergy[];
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  onMouseEnter,
  onMouseLeave,
  activatedSynergies = [],
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculateTooltipPosition = (mouseX: number, mouseY: number) => {
    if (!tooltipRef.current) return { x: mouseX + 10, y: mouseY - 10 };

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Account for scrollbar width (typically 17px on Windows)
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const availableWidth = viewportWidth - scrollbarWidth;

    let x = mouseX + 10;
    let y = mouseY - 10;

    // Check right boundary with scrollbar consideration
    if (x + tooltipRect.width > availableWidth) {
      x = mouseX - tooltipRect.width - 10;
    }

    // Check left boundary
    if (x < 0) {
      x = 10;
    }

    // Check bottom boundary
    if (y + tooltipRect.height > viewportHeight) {
      y = mouseY - tooltipRect.height - 10;
    }

    // Check top boundary
    if (y < 0) {
      y = 10;
    }

    return { x, y };
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsVisible(true);
    const pos = calculateTooltipPosition(e.clientX, e.clientY);
    setPosition(pos);
    onMouseEnter?.();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = calculateTooltipPosition(e.clientX, e.clientY);
    setPosition(pos);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    onMouseLeave?.();
  };

  const renderContent = () => {
    if (content.type === "champion") {
      const unit = content.data as Unit;
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{unit.name}</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 ${getCostColorClass(
                unit.cost
              )} text-white text-xs font-semibold rounded`}
            >
              Cost: {unit.cost}
            </span>
          </div>
          <div className="text-sm">
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Type:</span> {unit.type}
            </p>
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-300">Traits:</span>
              {unit.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-600 text-gray-200 text-xs rounded-full whitespace-nowrap"
                >
                  {trait}
                </span>
              ))}
            </div>
            <div className="border-t border-gray-600 pt-2 bg-gray-900/30 rounded p-2">
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Ability:</span>{" "}
                {unit.ability.name}
              </p>
              <p className="text-gray-400 text-xs leading-relaxed wrap-break-word">
                {highlightDamageValues(unit.ability.description)}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      const trait = content.data as Trait;
      const activatedSynergy = activatedSynergies.find(
        (s) => s.name === trait.name
      );
      const activatedThresholds = activatedSynergy?.activatedThresholds || [];

      return (
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">{trait.name}</h3>
          <p className="text-gray-300 text-sm mb-3">{trait.description}</p>
          {Object.keys(trait.bonuses).length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-200">Bonuses:</h4>
              {Object.entries(trait.bonuses).map(([key, value]) => {
                const isActivated = activatedThresholds.includes(key);
                return (
                  <div key={key} className="flex justify-between text-sm">
                    <span
                      className={
                        isActivated
                          ? "text-green-300 font-semibold"
                          : "text-gray-300"
                      }
                    >
                      {key}:
                    </span>
                    <span
                      className={
                        isActivated
                          ? "text-green-300 font-semibold"
                          : "text-gray-400"
                      }
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-linear-to-br from-gray-800 to-gray-900 border border-gray-500 shadow-2xl rounded-lg p-4 min-w-80 max-w-md pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {renderContent()}
        </div>
      )}
    </div>
  );
};
