import React, { useState } from 'react';
import { EditorFaq } from '../types';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  Power, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';

interface FaqInstructionsModuleProps {
  faqs: EditorFaq[];
  onAddFaq: (faq: EditorFaq) => void;
  onToggleFaq: (id: string) => void;
  onDeleteFaq: (id: string) => void;
}

export const FaqInstructionsModule: React.FC<FaqInstructionsModuleProps> = ({
  faqs,
  onAddFaq,
  onToggleFaq,
  onDeleteFaq,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState('Hook Retention');
  const [question, setQuestion] = useState('');
  const [instruction, setInstruction] = useState('');

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.instruction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !instruction.trim()) return;

    const newFaq: EditorFaq = {
      id: `faq-${Date.now()}`,
      category,
      question: question.trim(),
      instruction: instruction.trim(),
      isActive: true,
    };

    onAddFaq(newFaq);
    setIsFormOpen(false);
    setQuestion('');
    setInstruction('');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto p-4 md:p-6">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-white">Predefined FAQs & Custom Editor Rules</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Custom rules and Q&A shortcuts that CineFlow AI prioritizes when generating scripts, hooks, and editing notes.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? 'Cancel' : 'Add Rule / FAQ'}</span>
          </button>
        </div>

        {/* Security / System Prompt Safety Notice (Section 11 requirement) */}
        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>
            <strong>Prompt Injection Protection:</strong> Saved instructions here are treated as high-priority editor preferences, while uploaded user briefs remain data context and are never executed as system overrides.
          </span>
        </div>

        {/* New Rule Form */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              Add Custom Editor Rule or Q&A Trigger
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Hook Retention">Hook Retention</option>
                  <option value="Language & Localization">Language & Localization (Roman Urdu)</option>
                  <option value="Pacing & Cutting">Pacing & Cutting</option>
                  <option value="Audio & Sound Design">Audio & Sound Design</option>
                  <option value="Safe Zones & Typography">Safe Zones & Typography</option>
                  <option value="Offer & CTA Strategy">Offer & CTA Strategy</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Question / Trigger *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How should Roman Urdu scripts be formatted?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Instruction / Answer *</label>
              <textarea
                rows={3}
                required
                placeholder="The exact guideline or response the AI must follow when triggered..."
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
              >
                Save Rule
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search custom rules, categories, or editing guidelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`p-4 rounded-2xl border transition-all ${
                faq.isActive
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-slate-950/60 border-slate-850 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {faq.category}
                    </span>
                    <h3 className="text-xs font-bold text-white">{faq.question}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans pl-1">
                    {faq.instruction}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleFaq(faq.id)}
                    className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                      faq.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title={faq.isActive ? 'Rule is Active' : 'Rule is Disabled'}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">{faq.isActive ? 'Active' : 'Disabled'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteFaq(faq.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
