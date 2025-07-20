import React from "react";
import "./index.css";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Project } from "../../dto";
import { X } from "lucide-react";
import { observer } from "mobx-react-lite";
import projectStore from "../../store";

interface addProjectCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProjectCard = observer((props: addProjectCardProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Project>();
  const onSubmit: SubmitHandler<Project> = (data) =>
    projectStore.addProject(data);

  return (
    <div hidden={!props.isOpen} className="add-project-card">
      <div className="project-card-header">
        <h2 className="card-title">Новый проект</h2>
        <X className="close-card" onClick={props.onClose}></X>
      </div>

      <form className="add-project-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-part">
          <label htmlFor="title">Название</label>
          <input id="title" {...register("title", { required: true })} />
          {errors.title && <span>Задайте название проекта!</span>}
        </div>

        <div className="form-part">
          <label htmlFor="author">Автор</label>
          <input id="author" {...register("author", { required: true })} />
          {errors.author && <span>Задайте автора проекта!</span>}
        </div>
        <div className="form-part">
          <label htmlFor="image">Ссылка на изображение</label>
          <input id="image" {...register("image")} />
        </div>
        <div className="form-part">
          <label htmlFor="status">Статус</label>
          <select id="status" {...register("status", { required: true })}>
            <option value="Проверен">Проверен</option>
            <option value="Проверен">На проверке</option>
            <option value="Проверен">Не проверен</option>
          </select>
        </div>
        <div className="form-part">
          <label htmlFor="rating">Рейтинг</label>
          <input
            type="number"
            id="rating"
            {...register("rating", { min: 0 })}
          />
          {errors.rating && (
            <span>Задайте неотрицательный рейтинг проекта</span>
          )}
        </div>
        <button className="submit-button" type="submit">
          {" "}
          Добавить
        </button>
      </form>
    </div>
  );
});
