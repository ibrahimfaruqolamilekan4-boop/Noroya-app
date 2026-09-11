import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const RecitationReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ayahText, recognizedWords } = location.state || {};

  if (!ayahText) {
    navigate('/explore');
    return null;
  }

  const score = Math.floor(Math.random() * 20) + 80; // Simulated score

  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white">
      <h2 className="text-3xl font-serif text-[#D4AF37] mb-8">Recitation Review</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-[#1a1a1a] rounded-2xl border border-white/10">
          <h3 className="text-xl mb-4">Divine Score</h3>
          <div className="text-6xl font-bold text-[#D4AF37]">{score}%</div>
        </div>
        
        <div className="p-6 bg-[#1a1a1a] rounded-2xl border border-white/10">
          <h3 className="text-xl mb-4">Analysis</h3>
          <p>You recited {recognizedWords.length} words.</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/explore')}
        className="mt-8 px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-full"
      >
        Return to Explore
      </button>
    </div>
  );
};
