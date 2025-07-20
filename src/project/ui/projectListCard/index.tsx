import { useState } from "react";
import { observer } from "mobx-react-lite";
import { X, MapPin, Star, Trash2 } from "lucide-react";
import projectStore from "../../store";
import type { Project } from "../../dto";
import "./index.css";

interface ProjectListCardProps {
  isOpen: boolean;
  onClose: () => void;
  centerOnMark: (coordinates: number[]) => void;
}

const ProjectListCard = observer((props: ProjectListCardProps) => {
  const [activeTab, setActiveTab] = useState<
    "verified" | "review" | "unverified"
  >("verified");

  const getProjectsByStatus = (status: Project["status"]) => {
    return projectStore.allProjects.filter(
      (project) => project.status === status
    );
  };

  const verifiedProjects = getProjectsByStatus("Проверен");
  const reviewProjects = getProjectsByStatus("На проверке");
  const unverifiedProjects = getProjectsByStatus("Не проверен");

  const tabs = [
    {
      id: "verified" as const,
      label: `Проверенные (${verifiedProjects.length})`,
      color: "#d4f2d6",
      textColor: "#2d6e2f",
      projects: verifiedProjects,
    },
    {
      id: "review" as const,
      label: `На проверке (${reviewProjects.length})`,
      color: "#ecf1ae",
      textColor: "#545422",
      projects: reviewProjects,
    },
    {
      id: "unverified" as const,
      label: `Непроверенные (${unverifiedProjects.length})`,
      color: "#c9cacf",
      textColor: "#6d6f78",
      projects: unverifiedProjects,
    },
  ];

  const currentProjects =
    tabs.find((tab) => tab.id === activeTab)?.projects || [];

  const handleDeleteProject = (title: string, author: string) => {
    projectStore.deleteProject(title, author);
  };

  const handleIncrementRating = (title: string, author: string) => {
    projectStore.incrementRating(title, author);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="project-modal" hidden={!props.isOpen}>
      <div className="project-modal__container">
        <div className="project-modal__header">
          <h1 className="project-modal__title">Список проектов</h1>
          <X className="project-modal__close-icon" onClick={props.onClose} />
        </div>

        <div className="project-modal__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="project-modal__tab"
              style={{
                backgroundColor: tab.color,
                color: tab.textColor,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="project-modal__content">
          {currentProjects.length === 0 ? (
            <div className="project-modal__empty">
              <p>Нет проектов в данной категории</p>
            </div>
          ) : (
            <div className="project-list">
              {currentProjects.map((project) => (
                <div
                  key={`${project.title}-${project.author}`}
                  className="project-card"
                >
                  <div className="project-card__content">
                    <div className="project-card__image">
                      {project.image ? (
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="project-card__img"
                        />
                      ) : (
                        <span className="project-card__placeholder">
                          image placeholder
                        </span>
                      )}
                    </div>

                    <div className="project-card__info">
                      <div className="project-card__header">
                        <h3 className="project-card__title">{project.title}</h3>
                        {project.status === "Проверен" &&
                          project.rating >= 0 && (
                            <div className="project-card__rating">
                              <Star className="project-card__rating-icon" />
                              <span className="project-card__rating-text">
                                {project.rating > 999 ? "999+" : project.rating}
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="project-card__meta">
                        <span>{formatDate(project.created)}</span>
                        <span className="project-card__separator">•</span>
                        <span className="project-card__author">
                          {project.author}
                        </span>
                      </div>

                      <div className="project-card__actions">
                        <button
                          className="project-card__action-btn"
                          onClick={() =>
                            props.centerOnMark([
                              project.coordinateX,
                              project.coordinateY,
                            ])
                          }
                          title={`Координаты: ${project.coordinateX}, ${project.coordinateY}`}
                        >
                          <MapPin className="project-card__action-icon" />
                        </button>
                        {project.status === "Проверен" && (
                          <button
                            className="project-card__action-btn"
                            onClick={() =>
                              handleIncrementRating(
                                project.title,
                                project.author
                              )
                            }
                            title="Увеличить рейтинг"
                          >
                            <Star className="project-card__action-icon" />
                          </button>
                        )}
                        <button
                          className="project-card__action-btn"
                          onClick={() =>
                            handleDeleteProject(project.title, project.author)
                          }
                          title="Удалить проект"
                        >
                          <Trash2 className="project-card__action-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProjectListCard.displayName = "ProjectListCard";

export default ProjectListCard;
