export type CourseStatus = "chua-hoc" | "dang-hoc" | "hoan-thanh";

export interface MyCourse {
  courseId: string;
  status: CourseStatus;
  progress: number; // %
}

export const myCourses: MyCourse[] = [
  {
    courseId: "web-development",
    status: "dang-hoc",
    progress: 45,
  },
  {
    courseId: "english-communication",
    status: "hoan-thanh",
    progress: 100,
  },
  {
    courseId: "photoshop-design",
    status: "dang-hoc",
    progress: 20,
  },
];















