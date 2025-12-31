import React from 'react';
import { GenerationMode } from '../types';
import { Layers, Shirt, Maximize } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const modes = [
    {
      id: GenerationMode.COMPOSITE,
      label: 'Composite',
      icon: Layers,
      desc: 'Merge Object + Subject'
    },
    {
      id: GenerationMode.INPAINTING,
      label: 'Inpainting',
      icon: Shirt,
      desc: 'Change Cloth/Attribute'
    },
    {
      id: GenerationMode.OUTPAINTING,
      label: 'Outpainting',
      icon: Maximize,
      desc: 'Expand/Ratio Change'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              isActive
                ? 'border-blue-500 bg-blue-900/20 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:bg-slate-700/50'
            }`}
          >
            <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
            <span className="font-bold text-lg">{mode.label}</span>
            <span className="text-xs opacity-70 mt-1">{mode.desc}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;
