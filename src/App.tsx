import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clapperboard, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Film, 
  Layout, 
  Plus, 
  Trash2, 
  Download,
  Video,
  Eye,
  Settings2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { generateStoryboard, StoryboardResponse } from './services/geminiService';

const STYLES = [
  "Photorealistic Cinematic",
  "Cyberpunk Futuristic",
  "Studio Ghibli Anime",
  "Film Noir (Black & White)",
  "Hand-drawn Sketch",
  "3D Animation Pixar style",
  "Macro Photography",
  "Abstract Artistic"
];

export default function App() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyboard, setStoryboard] = useState<StoryboardResponse | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateStoryboard(idea, style);
      setStoryboard(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate storyboard. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col cinematic-grid selection:bg-[#E2FF4A] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#E2FF4A] rounded-lg flex items-center justify-center">
            <Film className="text-black w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">VisionDirector AI</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 text-sm font-medium text-white/60">
            <span className="text-[#E2FF4A]">Generator</span>
            <span className="hover:text-white cursor-pointer transition-colors">Library</span>
            <span className="hover:text-white cursor-pointer transition-colors">Settings</span>
          </div>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">
        {/* Input Pane */}
        <aside className="space-y-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
                <Layout className="w-3 h-3" /> Step 01
              </h2>
              <h1 className="font-display text-3xl font-bold tracking-tight">The Core Concept</h1>
            </div>
            <div className="relative group">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: A futuristic samurai dueling a holographic dragon in a neon rainy street..."
                className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#E2FF4A]/50 focus:ring-1 focus:ring-[#E2FF4A]/20 transition-all resize-none placeholder:text-white/20"
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 uppercase">
                {idea.length} chars
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <Settings2 className="w-3 h-3" /> Step 02
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                    style === s 
                      ? 'bg-[#E2FF4A] text-black border-[#E2FF4A]' 
                      : 'bg-white/5 text-white/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !idea}
            className={`w-full group relative overflow-hidden py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
              isGenerating || !idea
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'bg-[#E2FF4A] text-black hover:scale-[1.02] active:scale-95 neon-glow'
            }`}
          >
            {isGenerating ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Directing Scene...
              </>
            ) : (
              <>
                Generate Visual Script
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </aside>

        {/* Output Pane */}
        <section className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {!storyboard && !isGenerating && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 border border-white/5 border-dashed rounded-3xl"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Clapperboard className="w-10 h-10 text-white/10" />
                </div>
                <h3 className="text-xl font-medium text-white/40">Enter your vision to start</h3>
                <p className="text-sm text-white/20 max-w-xs">Your AI-generated storyboard will appear here in detailed cinematic format.</p>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-32 h-32 border-4 border-[#E2FF4A]/10 border-t-[#E2FF4A] rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-8 h-8 text-[#E2FF4A] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">Crafting your visual story...</h3>
                  <div className="flex gap-2 justify-center">
                    {["Writing script", "Framing visual", "Optimizing prompts"].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.5, repeat: Infinity, repeatDelay: 1 }}
                        className="text-[10px] font-mono text-white/30 uppercase"
                      >
                        • {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {storyboard && !isGenerating && (
              <motion.div 
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <header className="flex items-end justify-between border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-[#E2FF4A] text-sm font-mono uppercase tracking-[0.2em] mb-2">{storyboard.genre}</h2>
                    <h1 className="font-display text-5xl font-bold tracking-tight">{storyboard.title}</h1>
                  </div>
                  <div className="text-right text-white/40 text-xs font-mono uppercase">
                    Revision 0.1 | AI Visual Draft
                  </div>
                </header>

                <div className="grid gap-8">
                  {storyboard.scenes.map((scene, idx) => (
                    <motion.div
                      key={scene.sceneNumber}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all"
                    >
                      <div className="p-6 md:p-8 grid md:grid-cols-[1fr_1.5fr] gap-8">
                        {/* Visual Breakdown */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono uppercase">Scene {scene.sceneNumber}</span>
                            <span className="text-xs text-white/40 font-mono italic">{scene.duration}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-xs font-mono uppercase text-white/30 flex items-center gap-2">
                              <Eye className="w-3 h-3 text-[#E2FF4A]" /> Visual
                            </h4>
                            <p className="text-lg leading-snug font-medium">{scene.visualDescription}</p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-mono uppercase text-white/30 flex items-center gap-2">
                              <Play className="w-3 h-3 text-[#E2FF4A]" /> Action
                            </h4>
                            <p className="text-sm text-white/60 italic leading-relaxed">{scene.actionScript}</p>
                          </div>
                        </div>

                        {/* AI Prompt */}
                        <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex flex-col justify-between group-hover:border-[#E2FF4A]/20 transition-all">
                          <div className="space-y-3">
                            <h4 className="text-xs font-mono uppercase text-[#E2FF4A]/60 flex items-center gap-2">
                              <Video className="w-3 h-3" /> AI Video Prompt
                            </h4>
                            <p className="text-sm font-mono text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10 border-dashed">
                              {scene.videoPrompt}
                            </p>
                          </div>
                          
                          <div className="mt-6 flex items-center justify-between">
                            <p className="text-[10px] text-white/20 italic">Optimized for Sora / Kling / Runway Gen-3 Alpha</p>
                            <button
                              onClick={() => copyToClipboard(scene.videoPrompt, scene.sceneNumber)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all ${
                                copiedId === scene.sceneNumber 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : 'bg-white/10 hover:bg-[#E2FF4A] hover:text-black border border-white/10'
                              }`}
                            >
                              {copiedId === scene.sceneNumber ? (
                                <><Check className="w-3 h-3" /> Copied</>
                              ) : (
                                <><Copy className="w-3 h-3" /> Copy Prompt</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center pb-20">
                  <button 
                    onClick={() => {
                      setStoryboard(null);
                      setIdea("");
                    }}
                    className="flex items-center gap-2 text-white/20 hover:text-white transition-colors text-sm font-mono uppercase"
                  >
                    <Trash2 className="w-4 h-4" /> Start New Production
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
