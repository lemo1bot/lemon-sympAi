
import React from 'react';
import { GeminiResponseData, PotentialCondition, OTCRecommendation } from '../types';

interface ResultsDisplayProps {
  data: GeminiResponseData;
}

const OTCRecommendationCard: React.FC<{ rec: OTCRecommendation }> = ({ rec }) => (
  <div className="bg-slate-600 p-3 rounded shadow">
    <h5 className="font-semibold text-sky-300">{rec.medicineName}</h5>
    <p className="text-xs text-slate-300">{rec.dosage}</p>
  </div>
);

const ConditionCard: React.FC<{ condition: PotentialCondition }> = ({ condition }) => (
  <div className="bg-slate-700 p-4 rounded-lg shadow-md">
    <h4 className="text-xl font-semibold text-sky-400 mb-2">{condition.conditionName}</h4>
    {condition.reasoning && (
      <p className="text-sm text-slate-300 mb-2 italic">
        <strong>Reasoning:</strong> {condition.reasoning}
      </p>
    )}
    {condition.otcRecommendations && condition.otcRecommendations.length > 0 && (
      <>
        <h5 className="text-md font-medium text-slate-200 mt-3 mb-2">Suggested OTC Remedies:</h5>
        <div className="space-y-2">
          {condition.otcRecommendations.map((rec, idx) => (
            <OTCRecommendationCard key={idx} rec={rec} />
          ))}
        </div>
      </>
    )}
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-6 p-4 sm:p-6 bg-slate-800 shadow-xl rounded-lg border border-sky-700">
      <h3 className="text-2xl font-bold text-sky-300 mb-3 text-center">{data.analysisTitle}</h3>
      
      {data.summary && (
        <p className="text-md text-slate-300 mb-4 p-3 bg-slate-700 rounded-md shadow">
          <strong>Summary:</strong> {data.summary}
        </p>
      )}

      {data.potentialConditions && data.potentialConditions.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-slate-100 mb-2">Potential Conditions:</h4>
          {data.potentialConditions.map((condition, idx) => (
            <ConditionCard key={idx} condition={condition} />
          ))}
        </div>
      ) : (
        <p className="text-slate-300 text-center py-3">No specific conditions identified based on the input.</p>
      )}

      <div className="mt-6 p-4 bg-amber-700 bg-opacity-30 border border-amber-500 rounded-md text-amber-200">
        <h4 className="font-bold text-lg mb-1 text-amber-100">Important Disclaimer</h4>
        <p className="text-sm">{data.importantDisclaimer}</p>
      </div>
    </div>
  );
};
    