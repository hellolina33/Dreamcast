
import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from './Button';

interface FeedbackProps {
  onBack: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ onBack }) => {
  const [topic, setTopic] = useState("Theme Idea");
  const [text, setText] = useState("");

  const topics = [
      { id: "Theme Idea", label: "Theme Idea", icon: "💡" },
      { id: "Bug Report", label: "Bug Report", icon: null },
      { id: "Voice Quality", label: "Voice Quality", icon: null },
      { id: "Other", label: "Other", icon: null },
  ];

  return (
    <div className="flex flex-col h-full bg-night-900 animate-fade-in relative">
        <div className="flex items-center p-6 pb-2">
            <button onClick={onBack} className="p-2 -ml-2 text-white hover:text-dream-400">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="ml-4">
                <h2 className="text-lg font-bold text-white">Feedback & Suggestions</h2>
            </div>
        </div>

        <div className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Help us dream bigger</h1>
                <p className="text-slate-400 text-sm">Your feedback shapes the bedtime stories of tomorrow.</p>
            </div>

            <div className="mb-6">
                <label className="text-sm font-bold text-slate-300 block mb-3">What is this about?</label>
                <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTopic(t.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                topic === t.id
                                    ? 'bg-[#3c2de6] border-[#3c2de6] text-white shadow-lg shadow-[#3c2de6]/30'
                                    : 'bg-night-800 border-white/5 text-slate-400 hover:border-white/20'
                            }`}
                        >
                            {t.icon && <span className="mr-1">{t.icon}</span>}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                 <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tell us your thoughts... (e.g., My child loves dragons but wants a slower narration speed)"
                    className="w-full h-64 bg-night-800/50 border border-white/5 rounded-3xl p-5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3c2de6] resize-none"
                 />
            </div>

            <div className="text-center mb-8">
                <p className="text-xs text-slate-500 max-w-xs mx-auto">We read every message to improve your child's sleep journey.</p>
            </div>

            <Button onClick={onBack} className="shadow-xl shadow-[#3c2de6]/20 bg-[#3c2de6] hover:bg-[#3224bd]">
                Send Feedback <Send className="w-4 h-4 ml-1" />
            </Button>
        </div>
    </div>
  );
};
