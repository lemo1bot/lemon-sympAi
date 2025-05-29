
import React, { useState } from 'react';
import { getSymptomAnalysisFromText } from '../services/geminiService';
import { GeminiResponseData } from '../types';
import { ResultsDisplay } from './ResultsDisplay';
import { LoadingSpinner } from './LoadingSpinner';

export const SymptomDescriber: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<GeminiResponseData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError("Please describe your symptoms.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await getSymptomAnalysisFromText(symptoms);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-slate-800 shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold text-sky-400 mb-4 text-center">Describe Your Symptoms</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-slate-300 mb-1">
            Enter your symptoms below (e.g., "I have a headache and a runny nose for 2 days.")
          </label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={5}
            className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
            placeholder="Describe your symptoms here..."
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner small /> : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          )}
          Get AI Analysis
        </button>
      </form>
      
      {isLoading && !analysisResult && <LoadingSpinner message="Analyzing symptoms with AI..." />}
      {error && !isLoading && <p className="text-red-400 text-center py-4 bg-red-900 bg-opacity-30 rounded-md">{error}</p>}
      {analysisResult && <ResultsDisplay data={analysisResult} />}
    </div>
  );
};
    