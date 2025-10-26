import React, { useState, useRef, useEffect } from "react";

interface Suggestion {
  id: string;
  text: string;
  className?: string;
}

interface CustomTagInputProps {
  suggestions: Suggestion[];
  onAdd: (tag: { id: string; text: string }) => void;
  onDelete: (index: number) => void;
  tags: Array<{ id: string; text: string; className: string }>;
  inputValue: string;
  onInputChange: (value: string) => void;
}

export const CustomTagInput: React.FC<CustomTagInputProps> = ({
  suggestions,
  onAdd,
  onDelete,
  tags,
  inputValue,
  onInputChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownWidth, setDropdownWidth] = useState(150);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<number | null>(null);

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.text.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Show all suggestions when focused and input is empty
  const displaySuggestions = isFocused && filteredSuggestions.length > 0;

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Click is outside the component, close the dropdown
        setIsFocused(false);
        setHighlightedIndex(-1);
      }
    };

    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    // Match dropdown width to input width
    if (inputRef.current) {
      setDropdownWidth(inputRef.current.offsetWidth);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't close dropdown if clicking on the dropdown itself
    if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    // Don't close if clicking on another part of the container (e.g., tags)
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    // Delay closing the dropdown to allow click on suggestion to register
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      setHighlightedIndex(-1);
    }, 150);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // Cancel the blur timeout if it exists
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    onAdd({ id: suggestion.id, text: suggestion.text });
    onInputChange("");
    setIsFocused(true); // Keep focus on input
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!displaySuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsFocused(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-wrap gap-1 items-center overflow-visible"
    >
      {/* Tags */}
      {tags.map((tag, index) => (
        <div
          key={tag.id}
          className={`px-2 py-1 text-xs text-white rounded-full cursor-pointer transition-colors hover:opacity-80 flex items-center gap-1 ${tag.className}`}
        >
          <span>{tag.text}</span>
          <button
            onClick={() => onDelete(index)}
            className="ml-1 hover:font-bold"
            type="button"
          >
            ×
          </button>
        </div>
      ))}

      {/* Input Field Container - This will be the positioning reference for dropdown */}
      <div className="relative overflow-visible">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="Add champion..."
          className="px-2 py-1 text-xs bg-slate-600 text-white border border-slate-500 rounded focus:outline-none focus:border-blue-400 min-w-[150px]"
        />

        {/* Dropdown Suggestions */}
        {displaySuggestions && (
          <div
            ref={dropdownRef}
            className="absolute z-50 bg-slate-600 border border-slate-500 rounded mt-1 max-h-32 overflow-y-auto"
            style={{ top: "100%", left: 0, width: `${dropdownWidth}px` }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-2 py-1 text-xs text-white cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? "bg-slate-500"
                    : "hover:bg-slate-700"
                } ${
                  suggestion.className === "selected"
                    ? "bg-blue-900 text-gray-400 relative"
                    : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {suggestion.text}
                {suggestion.className === "selected" && (
                  <span className="absolute right-2 text-green-500 font-bold">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
