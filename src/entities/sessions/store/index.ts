import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IStudySession } from "../model";

interface StudySessionState {
  sessions: IStudySession[];
  // Actions
  addSession: (session: IStudySession) => void;
  updateSession: (id: string, updates: Partial<IStudySession>) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  // Selectors
  getSessionById: (id: string) => IStudySession | undefined;
  getSessionsByDateRange: (startDate: number, endDate: number) => IStudySession[];
  getTodaySessions: () => IStudySession[];
  getAverageSessionTime: () => number;
  getTotalStudyTime: () => number;
}

const initialState = {
  sessions: [],
};

export const useStudySessionStore = create<StudySessionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      addSession: (session) => {
        set(state => ({
          sessions: [...state.sessions, session]
        }));
      },

      updateSession: (id, updates) => {
        set(state => ({
          sessions: state.sessions.map(session => 
            session.id === id ? { ...session, ...updates } : session
          )
        }));
      },

      deleteSession: (id) => {
        set(state => ({
          sessions: state.sessions.filter(session => session.id !== id)
        }));
      },

      clearAllSessions: () => {
        set(initialState);
      },

      // Selectors
      getSessionById: (id) => {
        return get().sessions.find(session => session.id === id);
      },

      getSessionsByDateRange: (startDate, endDate) => {
        return get().sessions.filter(session => 
          session.startTime >= startDate && session.startTime <= endDate
        );
      },

      getTodaySessions: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return get().getSessionsByDateRange(today.getTime(), tomorrow.getTime());
      },

      getAverageSessionTime: () => {
        const { sessions } = get();
        if (sessions.length === 0) return 0;
        
        const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
        return totalTime / sessions.length;
      },

      getTotalStudyTime: () => {
        return get().sessions.reduce((sum, session) => sum + session.duration, 0);
      },
    }),
    {
      name: 'wordblock-study-sessions',
      partialize: (state) => ({
        sessions: state.sessions,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Study sessions rehydrated:', state);
      },
    }
  )
)