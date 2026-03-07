import React, { createContext, useContext, useState } from 'react';
import { MODELS } from '../constants';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  status: string;
  latency: string;
  tokenUsage: string;
  apiKey?: string;
  endpoint?: string;
}

interface ModelContextType {
  models: Model[];
  addModel: (model: Model) => void;
  updateModel: (id: string, model: Partial<Model>) => void;
  deleteModel: (id: string) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<Model[]>(() => {
    const saved = localStorage.getItem('ai_models');
    return saved ? JSON.parse(saved) : MODELS;
  });

  const addModel = (model: Model) => {
    const newModels = [...models, model];
    setModels(newModels);
    localStorage.setItem('ai_models', JSON.stringify(newModels));
  };

  const updateModel = (id: string, updatedModel: Partial<Model>) => {
    const newModels = models.map(m => m.id === id ? { ...m, ...updatedModel } : m);
    setModels(newModels);
    localStorage.setItem('ai_models', JSON.stringify(newModels));
  };

  const deleteModel = (id: string) => {
    const newModels = models.filter(m => m.id !== id);
    setModels(newModels);
    localStorage.setItem('ai_models', JSON.stringify(newModels));
  };

  return (
    <ModelContext.Provider value={{ models, addModel, updateModel, deleteModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModels = () => {
  const context = useContext(ModelContext);
  if (!context) throw new Error('useModels must be used within a ModelProvider');
  return context;
};
