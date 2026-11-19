import { create } from "zustand";

const initialStudents = [
  { id: 1, roll_number: "101", name: "Aman", section: "A", marks: 85 },
  { id: 2, roll_number: "102", name: "Simran", section: "B", marks: 92 },
  { id: 3, roll_number: "103", name: "Harman", section: "A", marks: 78 },
];

function saveToStorage(students) {
  try {
    localStorage.setItem("students_records_v3", JSON.stringify(students));
  } catch (err) {
    console.error("Failed to save students to localStorage", err);
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem("students_records_v3");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read students from localStorage", err);
  }
  return initialStudents;
}

export const useStudentStore = create((set) => ({
  students: loadFromStorage(),
  isLoading: false,
  isAuthenticated: Boolean(localStorage.getItem("hunter_auth")),
  currentUser: localStorage.getItem("hunter_auth") || null,

  login: (username) => {
    const user = username || "Hunter";
    localStorage.setItem("hunter_auth", user);
    set({ isAuthenticated: true, currentUser: user });
  },

  logout: () => {
    localStorage.removeItem("hunter_auth");
    set({ isAuthenticated: false, currentUser: null });
  },

  getRecords: () => {
    set({ isLoading: true });
    const students = loadFromStorage();
    set({ students, isLoading: false });
  },

  addRecord: (record) => {
    set((state) => {
      const newId =
        state.students.length > 0
          ? Math.max(...state.students.map((s) => s.id)) + 1
          : 1;
      const students = [
        ...state.students,
        {
          id: newId,
          ...record,
          marks: Number(record.marks) || 0,
        },
      ];
      saveToStorage(students);
      return { students };
    });
  },

  updateRecord: async (id, updatedStudent) => {
    set({ isLoading: true });
    // Small delay to simulate async network request if needed
    await new Promise((resolve) => setTimeout(resolve, 150));
    set((state) => {
      const targetId = parseInt(id, 10);
      const students = state.students.map((s) =>
        s.id === targetId ? { ...s, ...updatedStudent, id: targetId } : s
      );
      saveToStorage(students);
      return { students, isLoading: false };
    });
  },

  deleteRecord: (id) => {
    set((state) => {
      const targetId = parseInt(id, 10);
      const students = state.students.filter((s) => s.id !== targetId);
      saveToStorage(students);
      return { students };
    });
  },
}));
