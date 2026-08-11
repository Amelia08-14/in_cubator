import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface CandidatureData {
  // Step 1: Identity
  startupName: string;
  slogan: string;
  creationDate: string;
  country: string;
  website: string;
  description: string;

  // Step 2: Team
  team: TeamMember[];

  // Step 3: Sector & Stage
  sector: string;
  stage: string;

  // Step 4: Details & Needs
  problemSolved: string;
  needs: string;
}

const defaultData: CandidatureData = {
  startupName: '',
  slogan: '',
  creationDate: '',
  country: '',
  website: '',
  description: '',
  team: [{ id: crypto.randomUUID(), name: '', role: '', email: '' }],
  sector: '',
  stage: '',
  problemSolved: '',
  needs: '',
};

interface CandidatureState {
  currentStep: number;
  formData: CandidatureData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<CandidatureData>) => void;
  resetForm: () => void;
}

export const useCandidatureFormStore = create<CandidatureState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: defaultData,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set({ currentStep: 1, formData: defaultData }),
    }),
    {
      name: 'candidature-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
