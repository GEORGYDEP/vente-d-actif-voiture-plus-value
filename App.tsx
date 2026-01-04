
import React, { useState, useMemo, useEffect } from 'react';
import { ALL_EXERCISES } from './data/exercises';
import { Exercise } from './types';

const ITEMS_PER_LEVEL = 20;

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [submittedInput, setSubmittedInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Get current level's exercises
  const levelExercises = useMemo(() => {
    if (currentLevel === null) return [];
    return ALL_EXERCISES.slice(
      (currentLevel - 1) * ITEMS_PER_LEVEL,
      currentLevel * ITEMS_PER_LEVEL
    );
  }, [currentLevel]);

  const currentExercise = levelExercises[exerciseIndex];

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedInput(userInput);
    setShowResult(true);
  };

  const handleNext = () => {
    if (exerciseIndex < ITEMS_PER_LEVEL - 1) {
      setExerciseIndex(prev => prev + 1);
      setUserInput('');
      setSubmittedInput('');
      setShowResult(false);
    } else {
      // Level complete
      if (currentLevel !== null && !completedLevels.includes(currentLevel)) {
        setCompletedLevels(prev => [...prev, currentLevel]);
      }
      setCurrentLevel(null);
      setExerciseIndex(0);
      setUserInput('');
      setSubmittedInput('');
      setShowResult(false);
    }
  };

  const selectLevel = (lvl: number) => {
    setCurrentLevel(lvl);
    setExerciseIndex(0);
    setUserInput('');
    setSubmittedInput('');
    setShowResult(false);
  };

  // Fun header
  const Header = () => (
    <header className="bg-white shadow-md p-4 mb-8 sticky top-0 z-10 border-b-4 border-blue-500">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <span>🇫🇷</span> Maîtrise des Articles
        </h1>
        {currentLevel && (
          <button 
            onClick={() => setCurrentLevel(null)}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors"
          >
            ← Retour au menu
          </button>
        )}
      </div>
    </header>
  );

  if (currentLevel === null) {
    return (
      <div className="min-h-screen bg-sky-50 pb-12">
        <Header />
        <main className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Prêt à pratiquer votre français ?</h2>
            <p className="text-gray-600 text-lg">Choisissez un niveau pour commencer vos 20 exercices.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((lvl) => (
              <button
                key={lvl}
                onClick={() => selectLevel(lvl)}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-all transform hover:scale-105 active:scale-95 shadow-lg
                  ${completedLevels.includes(lvl) 
                    ? 'bg-green-100 border-2 border-green-500 text-green-700' 
                    : 'bg-white border-2 border-blue-200 hover:border-blue-500 text-blue-700'}
                `}
              >
                <span className="text-xs uppercase font-bold mb-1 opacity-70">Niveau</span>
                <span className="text-4xl font-black">{lvl}</span>
                {completedLevels.includes(lvl) && (
                  <span className="mt-2 text-xs font-bold">Complété ! ✅</span>
                )}
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 pb-12">
      <Header />
      <main className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            <span>Niveau {currentLevel}</span>
            <span>Exercice {exerciseIndex + 1} / {ITEMS_PER_LEVEL}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
            <div 
              className="bg-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${((exerciseIndex + 1) / ITEMS_PER_LEVEL) * 100}%` }}
            />
          </div>
        </div>

        {/* Exercise Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase mb-4">
              Consigne : Complétez ou transformez
            </span>
            <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {currentExercise.prompt}
            </h3>
          </div>

          {!showResult ? (
            <form onSubmit={handleCheck} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">Votre réponse :</label>
                <input
                  type="text"
                  autoFocus
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Écrivez ici..."
                  className="w-full text-xl p-4 border-2 border-blue-100 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1"
              >
                Vérifier la réponse
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Comparison Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Votre réponse :</p>
                  <p className="text-lg font-medium text-gray-700">{submittedInput || "(vide)"}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                  <p className="text-xs font-bold text-green-600 uppercase mb-1">La bonne réponse :</p>
                  <p className="text-lg font-bold text-gray-800">{currentExercise.answer}</p>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-sm font-bold text-blue-600 uppercase mb-2">La règle :</p>
                <p className="text-gray-700 italic leading-relaxed">{currentExercise.rule}</p>
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1"
              >
                {exerciseIndex < ITEMS_PER_LEVEL - 1 ? "Exercice suivant →" : "Terminer le niveau 🏆"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
