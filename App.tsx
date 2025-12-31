import React, { useState } from 'react';
import { GenerationMode, UploadedFile } from './types';
import { generateOptimizedPrompt } from './services/geminiService';
import ModeSelector from './components/ModeSelector';
import ImageUploader from './components/ImageUploader';
import { Wand2, Copy, AlertCircle, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.COMPOSITE);
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText && uploadedFiles.length === 0) {
      setError('Please provide text instructions or upload an image to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt(null);

    try {
      const files = uploadedFiles.map(f => f.file);
      const prompt = await generateOptimizedPrompt(inputText, files, mode);
      setGeneratedPrompt(prompt);
    } catch (err) {
      setError('Failed to generate prompt. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      // Optional: Add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                Visual Prompt Architect
              </h1>
              <p className="text-xs text-slate-500 font-medium">AI-Powered Image Analysis & Prompt Engineering</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Gemini 3 Pro
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Intro */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3 text-slate-100">Create the Perfect Prompt</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Upload images for context analysis or describe your vision. The AI will architect a strictly formatted prompt optimized for high-end image generators.
          </p>
        </div>

        {/* Mode Selector */}
        <ModeSelector currentMode={mode} onModeChange={setMode} />

        {/* Input Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
          
          <ImageUploader 
            files={uploadedFiles} 
            onFilesChange={setUploadedFiles} 
            maxFiles={mode === GenerationMode.COMPOSITE ? 2 : 1}
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Vision / Instructions
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`e.g., "Make the bottle huge relative to the model" or "Change the suit to a red dress"`}
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-600"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
              isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Analyzing & Architecting...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Optimized Prompt
              </>
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Output Section */}
        {generatedPrompt && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-200">Architected Prompt Result</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </button>
            </div>
            <div className="bg-black/50 border border-slate-700 rounded-xl p-6 font-mono text-sm leading-relaxed text-green-400 shadow-inner relative group">
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Midjourney/SD Optimized</span>
              </div>
              {generatedPrompt}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
