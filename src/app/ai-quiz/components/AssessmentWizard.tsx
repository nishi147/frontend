import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions, Question } from './questions';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

interface AssessmentWizardProps {
  studentName: string;
  isParent: boolean;
  onSubmit: (answers: Record<number, any>, finalScore: number) => void;
}

export default function AssessmentWizard({ studentName, isParent, onSubmit }: AssessmentWizardProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const QUESTIONS_PER_PAGE = 4;
  const totalPages = 5;

  // Get questions for the current page
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  // Helper to format question text grammatically based on role
  const formatQuestionText = (text: string) => {
    const name = studentName || "your child";
    if (isParent) {
      return text.replace(/your child's/gi, `${name}'s`).replace(/your child/gi, name);
    } else {
      let formatted = text
        .replace(/your child's/gi, "your")
        .replace(/your child/gi, "you")
        .replace(/does you/gi, "do you")
        .replace(/has you/gi, "have you")
        .replace(/is you/gi, "are you")
        .replace(/you adapt/gi, "you adapt"); // standard
      return formatted;
    }
  };

  const renderQuestionText = (text: string) => {
    const formatted = formatQuestionText(text);
    if (!studentName || !isParent) {
      return <span>{formatted}</span>;
    }
    const escapedName = studentName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedName})\\b`, 'gi');
    const parts = formatted.split(regex);
    return (
      <>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <span key={index} className="text-[#0D47A1] font-black underline decoration-2 decoration-[#0D47A1]/20 underline-offset-4">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleSelectSingle = (questionId: number, text: string, weight: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { type: 'single', value: text, weight }
    }));
  };

  const handleSelectMultiple = (questionId: number, text: string, weight: number) => {
    const currentAnswer = answers[questionId] || { type: 'multiple', value: [] };
    const valuesList: string[] = currentAnswer.value;

    let updatedList: string[];
    if (valuesList.includes(text)) {
      updatedList = valuesList.filter(v => v !== text);
    } else {
      updatedList = [...valuesList, text];
    }

    // Score is count of selected options (each is weight 1) up to a max of 4
    const totalWeight = updatedList.length;

    setAnswers(prev => ({
      ...prev,
      [questionId]: { type: 'multiple', value: updatedList, weight: totalWeight }
    }));
  };

  const handleSelectRating = (questionId: number, rating: number) => {
    // Standard rating is 1-5. Weight is rating * 0.8 to fit into max weight of 4.
    const calculatedWeight = parseFloat((rating * 0.8).toFixed(1));
    setAnswers(prev => ({
      ...prev,
      [questionId]: { type: 'rating', value: rating, weight: calculatedWeight }
    }));
  };

  // Check if all questions on the current page are answered
  const isPageComplete = () => {
    return pageQuestions.every(q => {
      const ans = answers[q.id];
      return ans && ans.value !== undefined;
    });
  };

  // Calculate overall completion percentage
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      calculateAndSubmit();
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const calculateAndSubmit = () => {
    // Sum weights of all questions
    let totalScore = 0;
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans && ans.weight) {
        totalScore += ans.weight;
      }
    });

    // Scale score to a max of 100
    const maxPossibleScore = questions.length * 4;
    const finalScore = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100));
    onSubmit(answers, finalScore);
  };

  // Page title / category label
  const pageCategoryLabel = pageQuestions[0]?.categoryLabel || 'Diagnostic';

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-[#f8fafc] to-white flex-1">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <div>
              <span className="text-xs font-black text-secondary-500 uppercase tracking-widest block mb-0.5">
                Section {currentPage + 1} of {totalPages}
              </span>
              <h3 className="font-baloo font-black text-navy-900 text-lg sm:text-xl">
                {pageCategoryLabel}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-primary-500 font-baloo">
                {progressPercent}% Completed
              </span>
              <span className="text-xs text-gray-400 font-bold block">
                {answeredCount} of {totalQuestions} Answered
              </span>
            </div>
          </div>
          {/* Progress Bar Track */}
          <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden relative">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Questions Wizard Form */}
        <div className="min-h-[450px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {pageQuestions.map((q, qIdx) => {
                const ans = answers[q.id];
                
                return (
                  <div 
                    key={q.id} 
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm relative overflow-hidden"
                  >
                    {/* Corner Number */}
                    <div className="absolute top-0 right-0 bg-gray-50 border-bl border-gray-100 text-gray-300 font-baloo font-black text-sm px-4 py-2 rounded-bl-2xl">
                      Q{q.id}
                    </div>

                    <h4 className="font-baloo font-bold text-navy-900 text-base sm:text-lg mb-6 leading-relaxed pr-8">
                      {renderQuestionText(q.text)}
                    </h4>

                    {/* SINGLE SELECT */}
                    {q.options && (
                      <div className="flex flex-col gap-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = ans?.value === opt.text;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectSingle(q.id, opt.text, opt.weight)}
                              className={`w-full px-5 py-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'border-[#0D47A1] bg-[#EEE8FF]/20 text-[#0D47A1]'
                                  : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-baloo font-black text-sm transition-colors ${
                                  isSelected ? 'bg-[#0D47A1] text-white' : 'bg-gray-100 text-[#0D47A1]'
                                }`}>
                                  {opt.label}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-[#0D47A1] text-white flex items-center justify-center shrink-0 ml-3">
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 2. MULTIPLE CHOICE */}
                    {q.type === 'multiple_choice' && q.options && (
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                          Select all that apply:
                        </span>
                        {q.options.map((opt, optIdx) => {
                          const isSelected = ans?.value?.includes(opt.text);
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectMultiple(q.id, opt.text, opt.weight)}
                              className={`w-full px-5 py-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'border-[#FF7F50] bg-[#FFF5E6]/20 text-[#FF7F50]'
                                  : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50/50'
                              }`}
                            >
                              <span>{opt.text}</span>
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ml-3 transition-colors ${
                                isSelected ? 'bg-[#FF7F50] border-[#FF7F50] text-white' : 'border-gray-200'
                              }`}>
                                {isSelected && <Check size={12} strokeWidth={3} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 3. RATING SCALE (1-5) */}
                    {q.type === 'rating_scale' && (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="flex items-center gap-3 sm:gap-5">
                          {[1, 2, 3, 4, 5].map((num) => {
                            const isSelected = ans?.value === num;
                            const isHoveredOrBelow = ans?.value >= num;
                            return (
                              <button
                                key={num}
                                type="button"
                                onClick={() => handleSelectRating(q.id, num)}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 font-baloo font-black text-lg sm:text-xl flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'border-[#E91E63] bg-[#E91E63] text-white scale-110 shadow-md shadow-[#E91E6320]'
                                    : isHoveredOrBelow
                                      ? 'border-[#FCE4EC] bg-[#FCE4EC] text-[#E91E63]'
                                      : 'border-gray-100 hover:border-gray-200 text-gray-400 hover:bg-gray-50/50'
                                }`}
                              >
                                {num}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex justify-between w-full max-w-[280px] sm:max-w-[340px] mt-4 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">
                          <span>Not interested / rarely</span>
                          <span className="text-right">Highly active / always</span>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-10 gap-4">
            <button
              onClick={handleBack}
              disabled={currentPage === 0}
              className={`px-6 py-4 rounded-2xl border-2 font-black text-sm uppercase tracking-wide flex items-center gap-2 transition-all ${
                currentPage === 0
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50/20'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50 active:translate-y-0.5'
              }`}
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isPageComplete()}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                !isPageComplete()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : currentPage === totalPages - 1
                    ? 'bg-[#E91E63] hover:bg-[#D81B60] text-white hover:scale-103 active:translate-y-0.5'
                    : 'bg-[#0D47A1] hover:bg-[#0B3C87] text-white hover:scale-103 active:translate-y-0.5'
              }`}
            >
              {currentPage === totalPages - 1 ? (
                <>
                  <Sparkles size={16} /> Calculate AI Readiness
                </>
              ) : (
                <>
                  Next Section <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
