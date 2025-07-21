import { useState } from "react";
import { MapPinPlus } from "lucide-react";
import "./index.css";
import { AddProjectCard } from "../addProjectCard";
import { observer } from "mobx-react-lite";
import projectStore from "../../store";

export const AddProjectButton = observer(() => {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const onCardClose = () => {
    setIsCardOpen(false);
  };

  return (
    <>
      <button
        hidden={isCardOpen}
        className="add-project-button"
        onClick={() => {
          setIsCardOpen(true);
          projectStore.switchIsOpenForAddingMark(true);
        }}
      >
        <span>
          <MapPinPlus></MapPinPlus>
          <h2>Добавить проект</h2>
        </span>
      </button>
      <AddProjectCard
        isOpen={isCardOpen}
        onClose={onCardClose}
      ></AddProjectCard>
    </>
  );
});
