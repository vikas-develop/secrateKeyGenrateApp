import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SavedSecret {
  id: string;
  secret: string;
  algorithm: string;
  timestamp: number;
  strength?: {
    score: number;
    strength: string;
    entropy: number;
  };
}

interface SecretState {
  // History state
  history: SavedSecret[];
  addToHistory: (secret: string, algorithm: string, strength?: SavedSecret["strength"]) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  
  // Current generation state
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;
  length: number;
  setLength: (length: number) => void;
  generatedSecret: string;
  setGeneratedSecret: (secret: string) => void;
  
  // Batch generation state
  batchSecrets: Array<{ id: string; secret: string; algorithm: string; timestamp: number }>;
  setBatchSecrets: (secrets: Array<{ id: string; secret: string; algorithm: string; timestamp: number }>) => void;
  clearBatchSecrets: () => void;
  
  // Configuration state
  includeSymbols: boolean;
  setIncludeSymbols: (value: boolean) => void;
  segments: number;
  setSegments: (value: number) => void;
  segmentLength: number;
  setSegmentLength: (value: number) => void;
  bytes: number;
  setBytes: (value: number) => void;
  passwordOptions: {
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
  };
  setPasswordOptions: (options: Partial<SecretState["passwordOptions"]>) => void;
  
  // Custom character set state
  customCharacterSet: string;
  setCustomCharacterSet: (charset: string) => void;
  useCustomCharacterSet: boolean;
  setUseCustomCharacterSet: (value: boolean) => void;
  excludeSimilarCharacters: boolean;
  setExcludeSimilarCharacters: (value: boolean) => void;
}

const MAX_HISTORY_ITEMS = 50;

export const useSecretStore = create<SecretState>()(
  persist(
    (set) => ({
      // History state
      history: [],
      addToHistory: (secret, algorithm, strength) =>
        set((state) => {
          const newSecret: SavedSecret = {
            id: crypto.randomUUID(),
            secret,
            algorithm,
            timestamp: Date.now(),
            strength,
          };
          const updatedHistory = [newSecret, ...state.history].slice(0, MAX_HISTORY_ITEMS);
          return { history: updatedHistory };
        }),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),

      // Current generation state
      algorithm: 'alphanumeric',
      setAlgorithm: (algorithm) => set({ algorithm }),
      length: 32,
      setLength: (length) => set({ length }),
      generatedSecret: '',
      setGeneratedSecret: (secret) => set({ generatedSecret: secret }),

      // Configuration state
      includeSymbols: true,
      setIncludeSymbols: (value) => set({ includeSymbols: value }),
      segments: 4,
      setSegments: (value) => set({ segments: value }),
      segmentLength: 4,
      setSegmentLength: (value) => set({ segmentLength: value }),
      bytes: 16,
      setBytes: (value) => set({ bytes: value }),
      passwordOptions: {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
      },
          setPasswordOptions: (options) =>
            set((state) => ({
              passwordOptions: { ...state.passwordOptions, ...options },
            })),
          
          // Batch generation state
          batchSecrets: [],
          setBatchSecrets: (secrets) => set({ batchSecrets: secrets }),
          clearBatchSecrets: () => set({ batchSecrets: [] }),
          
          // Custom character set state
          customCharacterSet: '',
          setCustomCharacterSet: (charset) => set({ customCharacterSet: charset }),
          useCustomCharacterSet: false,
          setUseCustomCharacterSet: (value) => set({ useCustomCharacterSet: value }),
          excludeSimilarCharacters: false,
          setExcludeSimilarCharacters: (value) => set({ excludeSimilarCharacters: value }),
    }),
    {
      name: 'secret-generator-history', // Match the old localStorage key for compatibility
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        // Persist user preferences
        algorithm: state.algorithm,
        length: state.length,
        includeSymbols: state.includeSymbols,
        segments: state.segments,
        segmentLength: state.segmentLength,
        bytes: state.bytes,
        passwordOptions: state.passwordOptions,
        customCharacterSet: state.customCharacterSet,
        useCustomCharacterSet: state.useCustomCharacterSet,
        excludeSimilarCharacters: state.excludeSimilarCharacters,
      }),
      // Migrate old data format if needed
      migrate: (persistedState: any, version: number) => {
        if (persistedState && Array.isArray(persistedState.history)) {
          // Ensure all history items have proper structure
          persistedState.history = persistedState.history.map((item: any) => ({
            ...item,
            id: item.id || crypto.randomUUID(),
            timestamp: item.timestamp || Date.now(),
          }));
        }
        return persistedState;
      },
    }
  )
);

