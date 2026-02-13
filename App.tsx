import React, { useState } from 'react';
import { Header } from './components/Header';
import { VideoUploader } from './components/VideoUploader';
import { analyzeVideoContent } from './services/geminiService';
import { AnalysisState, VideoData } from './types';
import { Loader2, Send, Wand2, FileText, CheckCircle2, Video } from 'lucide-react';

const DEFAULT_PROMPT = "Provide a detailed summary of this video. Identify key events, describe the setting, and list any text or dialogue that appears significant.";

export default function App() {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null
  });

  const handleAnalyze = async () => {
    if (!videoData) return;

    setAnalysis({ isLoading: true, error: null, result: null });

    try {
      const result = await analyzeVideoContent(
        videoData.base64Data,
        videoData.mimeType,
        prompt
      );
      setAnalysis({ isLoading: false, error: null, result });
    } catch (err: any) {
      setAnalysis({ 
        isLoading: false, 
        error: err.message || "An unexpected error occurred.", 
        result: null 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Section */}
        <section className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
            Understand your videos in seconds
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload a clip and let Gemini's multimodal capabilities analyze the visual and audio content to provide detailed summaries and insights.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-1 border border-slate-700/50">
              <div className="bg-slate-900 rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-xs text-white">1</span>
                    Upload Video
                  </h3>
                  <VideoUploader 
                    onVideoSelected={setVideoData} 
                    selectedVideo={videoData}
                    isDisabled={analysis.isLoading}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-xs text-white">2</span>
                    Ask Gemini
                  </h3>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={analysis.isLoading}
                      className="w-full bg-slate-800 text-slate-200 rounded-lg p-4 pb-12 min-h-[140px] border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none placeholder-slate-500"
                      placeholder="What would you like to know about this video?"
                    />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <button 
                        onClick={() => setPrompt("Describe the visual style and camera angles used in this clip.")}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors"
                      >
                        Visual Style
                      </button>
                      <button 
                        onClick={() => setPrompt("List the chronological sequence of events.")}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors"
                      >
                        Timeline
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!videoData || analysis.isLoading}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                    ${!videoData || analysis.isLoading 
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25'
                    }`}
                >
                  {analysis.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Video...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="space-y-6">
             <div className="bg-slate-800/50 rounded-2xl p-1 border border-slate-700/50 h-full min-h-[500px]">
                <div className="bg-slate-900 rounded-xl p-6 h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Analysis Results
                  </h3>

                  {analysis.error && (
                    <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200">
                      <p className="font-semibold">Analysis Failed</p>
                      <p className="text-sm mt-1 opacity-80">{analysis.error}</p>
                    </div>
                  )}

                  {!analysis.result && !analysis.isLoading && !analysis.error && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-60">
                      <Wand2 className="w-16 h-16" />
                      <p className="text-center max-w-xs">Upload a video and start the analysis to see AI insights here.</p>
                    </div>
                  )}

                  {analysis.isLoading && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                       <div className="relative">
                          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-6 h-6 text-indigo-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="text-center space-y-2">
                          <p className="text-lg font-medium text-white">Analyzing Video Frames</p>
                          <p className="text-sm text-slate-400">This may take a minute depending on video length...</p>
                       </div>
                    </div>
                  )}

                  {analysis.result && (
                    <div className="prose prose-invert prose-slate max-w-none">
                       <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-6 flex items-center gap-2 text-emerald-400 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Analysis Complete
                       </div>
                       <div className="whitespace-pre-wrap text-slate-300 leading-relaxed bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                        {analysis.result}
                       </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}