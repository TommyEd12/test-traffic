import { makeAutoObservable, reaction } from "mobx";
import type { Project } from "../dto";

const LOCAL_STORAGE_KEY = "projects";

class ProjectStore {
  projects: Project[] = [];
  currentX = 0;
  currentY = 0;
  isOpenForAddingMark = false;

  constructor() {
    makeAutoObservable(this);

    this.loadProjects();

    reaction(
      () => this.projects.length,
      () => this.saveProjects()
    );
  }

  private loadProjects() {
    const savedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedProjects) {
      try {
        this.projects = JSON.parse(savedProjects);
      } catch (error) {
        console.error(error);
      }
    }
  }

  private saveProjects() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.projects));
  }

  switchIsOpenForAddingMark(value: boolean) {
    this.isOpenForAddingMark = value;
  }

  setCurrentCoordinates(x: number, y: number) {
    this.currentX = x;
    this.currentY = y;
  }

  addProject(project: Project) {
    let isProjectAdded = false;
    this.projects.map((p) => {
      if (p.author === project.author && p.title === project.title) {
        isProjectAdded = true;
        return;
      }
    });
    if (!isProjectAdded) {
      const newProject: Project = {
        ...project,
        rating: project.rating || 0,
        created: new Date(Date.now()).toDateString(),
        coordinateX: this.currentX,
        coordinateY: this.currentY,
      };
      this.projects.push(newProject);
    }
  }

  deleteProject(title: string, author: string) {
    this.projects = this.projects.filter(
      (project) => project.title !== title || project.author !== author
    );
  }

  incrementRating(title: string, author: string) {
    const project = this.projects.find(
      (p) => p.title === title && p.author === author
    );

    if (project && project.status === "Проверен") {
      project.rating += 1;
    }
  }

  get allProjects() {
    return this.projects;
  }
}

const projectStore = new ProjectStore();
export default projectStore;
