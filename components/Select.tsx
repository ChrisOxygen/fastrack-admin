import { SelectItem } from "@/providers/TransactionContext";
import { menu } from "@nextui-org/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

type SelectProps = {
  filterType: "type" | "status";
  filterItems: SelectItem[];
  selectItem: (item: SelectItem & { filterType: "type" | "status" }) => void;
};

type StateType = {
  menuOpen: boolean;
  items: SelectItem[] | null;
};

const initialState: StateType = {
  menuOpen: false,
  items: null,
};

function reducer(state: StateType, action: { type: any; payload?: any }) {
  switch (action.type) {
    case "toggleMenu":
      return { ...state, menuOpen: !state.menuOpen };
    case "setItems":
      return {
        ...state,
        items: action.payload as SelectItem[],
      };

    case "reset":
      return initialState;

    default:
      throw new Error("unknown action");
  }
}

function Select({
  filterType: currentFilter,
  filterItems,
  selectItem,
}: SelectProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const displayAreaRef = useRef<HTMLDivElement | null>(null);
  const { menuOpen, items } = state;
  useEffect(() => {
    dispatch({ type: "setItems", payload: filterItems });
  }, [filterItems]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current &&
        displayAreaRef.current &&
        !dropDownRef.current.contains(event.target as Node) &&
        !displayAreaRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: "toggleMenu" });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const displayText = () => {
    const selectedLabelCount = items?.filter((item) => item.isSelected).length;

    const selectedLabelText = selectedLabelCount
      ? `: (${selectedLabelCount})`
      : ": All";

    return `${currentFilter}${selectedLabelText}`;
  };

  function handleMenuToggle() {
    dispatch({ type: "toggleMenu" });
  }

  function handleItemClick(item: SelectItem) {
    selectItem({ ...item, filterType: currentFilter });
  }
  return (
    <div
      className="relative font-dm_sans text-siteHeadingDark  "
      ref={displayAreaRef}
    >
      <button
        onClick={() => handleMenuToggle()}
        className={`font-bold flex items-center justify-between py-3 px-4 rounded-xl border w-full  sm:w-[160px] ${
          menuOpen ? "border-green-500/30" : "border-siteHeadingDark/30"
        }`}
      >
        <span className="">{displayText()}</span>
        <span className={`${menuOpen && "rotate-180 text-green-500"}`}>
          <FiChevronDown />
        </span>
      </button>
      {menuOpen && (
        <div
          ref={dropDownRef}
          className="flex  flex-col gap-3 py-3 px-4 rounded-xl w-[240px] shadow-md mt-3 absolute bg-white"
        >
          <ul className=" flex flex-col gap-2">
            {items &&
              items.map((item) => (
                <li
                  key={item.key}
                  className={`font-semibold font-dm_sans border-b border-siteHeadingDark/20 last:border-b-0 pb-3  ${
                    item.isSelected && " font-bold text-green-500"
                  } `}
                >
                  <button
                    onClick={() => handleItemClick(item)}
                    className=" flex items-center w-full justify-between"
                  >
                    {item.label}
                    {item.isSelected && <FiCheck />}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Select;
