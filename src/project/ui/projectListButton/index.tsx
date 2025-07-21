import { useState } from "react";
import "./index.css";
import ProjectListCard from "../projectListCard";
import { List } from "lucide-react";

interface projectListButtonProps {
  centerOnMark: (coordinates: number[]) => void;
}

export const ProjectListButton = (props: projectListButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        hidden={isOpen}
        className="open-project-list-button"
      >
        <span>
          <h2>Список проектов</h2>
          <List></List>
        </span>
      </button>
      <ProjectListCard
        centerOnMark={props.centerOnMark}
        isOpen={isOpen}
        onClose={onClose}
      ></ProjectListCard>
    </>
  );
};
