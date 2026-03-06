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
}

interface ModelContextType {
  models: Model[];
  addModel: (model: Model) => void;
  updateModel: (id: string, model: Partial<Model>) => void;
  deleteModel: (id: string) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<Model[]>(MODELS);

  const addModel = (model: Model) => setModels([...models, model]);
  const updateModel = (id: string, updatedModel: Partial<Model>) => 
    setModels(models.map(m => m.id === id ? { ...m, ...updatedModel } : m));
  const deleteModel = (id: string) => setModels(models.filter(m => m.id !== id));

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
