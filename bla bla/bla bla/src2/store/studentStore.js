import { create } from "zustand";

const seed = [
  { id: 1, name: "Aman", course: "CSE" },
  { id: 2, name: "Simran", course: "ECE" },
  { id: 3, name: "Harman", course: "ME" },
];

function save(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

export const useStudentStore = create((set) => ({
  students: [],
  getRecords: () => {
    const raw = localStorage.getItem("students");
    const students = raw ? JSON.parse(raw) : seed;
    save(students);
    set({ students });
  },
  addRecord: (record) =>
    set((state) => {
      const students = [...state.students, { id: Date.now(), ...record }];
      save(students);
      return { students };
    }),
  deleteRecord: (id) =>
    set((state) => {
      const students = state.students.filter((s) => s.id !== id);
      save(students);
      return { students };
    }),
}));