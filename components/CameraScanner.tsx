
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeImageWithGemini } from '../services/geminiService';
import { GeminiResponseData } from '../types';
import { ResultsDisplay } from './ResultsDisplay';
import { LoadingSpinner } from './LoadingSpinner';

export const CameraScanner: React.FC = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<GeminiResponseData | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    setAnalysisResult(null);
    setImageData(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setError("Camera access is not supported by your browser.");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof Error) {
         if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Camera permission denied. Please enable camera access in your browser settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setError("No camera found. Please ensure a camera is connected and enabled.");
        }
         else {
          setError("Could not access camera. Please ensure it's not in use by another application.");
        }
      } else {
        setError("An unknown error occurred while accessing the camera.");
      }
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Re-run if startCamera identity changes (it shouldn't due to useCallback with empty deps)

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && stream) {
      setError(null);
      setAnalysisResult(null);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageData(dataUrl);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!imageData) {
      setError("Please capture an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeImageWithGemini(imageData);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setImageData(null);
    setAnalysisResult(null);
    setError(null);
    if (!stream && videoRef.current && !videoRef.current.srcObject) {
        startCamera(); // Restart camera if it was stopped or failed
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-slate-800 shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold text-sky-400 mb-4 text-center">Scan Visible Symptom</h2>
      
      {!imageData && (
        <div className="bg-slate-700 p-4 rounded-md shadow">
          {error && !stream && (
            <div className="text-center mb-4">
                <p className="text-red-400">{error}</p>
                <button 
                    onClick={startCamera}
                    className="mt-2 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
                >
                    Retry Camera Access
                </button>
            </div>
          )}
          <video ref={videoRef} autoPlay playsInline className={`w-full max-w-md mx-auto rounded-md aspect-video bg-slate-900 ${!stream ? 'hidden' : ''}`}></video>
          {!stream && !error && <LoadingSpinner message="Initializing camera..." />}
          {stream && (
            <button
              onClick={handleCapture}
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.015h-.008V10.5Z" />
              </svg>
              Capture Image
            </button>
          )}
        </div>
      )}

      {imageData && (
        <div className="bg-slate-700 p-4 rounded-md shadow text-center">
          <h3 className="text-xl font-medium text-sky-300 mb-3">Captured Image Preview</h3>
          <img src={imageData} alt="Captured symptom" className="max-w-xs mx-auto rounded-md mb-4 border-2 border-sky-500" />
          <div className="flex justify-center space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner small /> : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}
              Analyze Symptom
            </button>
            <button
              onClick={handleRetake}
              disabled={isLoading}
              className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Retake
            </button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden"></canvas>

      {isLoading && !analysisResult && <LoadingSpinner message="Analyzing image with AI..." />}
      {error && !isLoading && <p className="text-red-400 text-center py-4 bg-red-900 bg-opacity-30 rounded-md">{error}</p>}
      {analysisResult && <ResultsDisplay data={analysisResult} />}
    </div>
  );
};
    