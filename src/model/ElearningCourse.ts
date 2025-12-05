export interface ElearningCourse {
  id: string;
  title: string;
  shortDescription?: string | null;
  description?: string | null;
  categoryId: string;
  thumbnail?: string | null;
  price: string;
  level?: "beginner" | "intermediate" | "advanced";
  duration?: string;
  lessons?: number;
  content?: string | null;
  status?: "active" | "inactive";
}
export interface ElearningCourseListParams {
     page?: number;
  limit?: number;
  search?: string;
  category?: string;
}
