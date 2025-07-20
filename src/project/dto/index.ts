export interface Project {
  title: string;
  author: string;
  image?: string;
  coordinateX: number;
  coordinateY: number;
  created: string;
  status: "Проверен" | "На проверке" | "Не проверен";
  rating: number;
}
