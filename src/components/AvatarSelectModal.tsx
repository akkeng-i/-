import React from 'react';
import { CHARACTERS } from '../assets/characterData';
import { sounds } from '../soundEngine';

interface AvatarSelectModalProps {
  isOpen: boolean;
  studentName: string;
  onClose: () => void;
  onSelectAvatar: (avatarId: string, avatarImg: string) => void;
}

export const AvatarSelectModal: React.FC<AvatarSelectModalProps> = ({
  isOpen,
  studentName,
  onClose,
  onSelectAvatar
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#E0F2FE] border-4 border-black shadow-[10px_10px_0px_#000] p-6 text-center animate-in fade-in duration-200">
        {/* Title */}
        <div className="inline-block bg-[#FEF08A] border-3 border-black px-4 py-1.5 shadow-[3px_3px_0px_#000] mb-3">
          <span className="text-xl md:text-2xl font-black text-black">
            🎣 낚시 파트너를 골라봐!
          </span>
        </div>

        <p className="text-base md:text-lg font-bold text-gray-800 mb-6">
          안녕, <span className="text-blue-600 font-black underline decoration-4 decoration-yellow-400">{studentName}</span>아! 
          함께 호수로 떠날 친구를 터치해줘!
        </p>

        {/* 4 Pokemon Avatar Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {CHARACTERS.map((char, index) => {
            const floatDelays = ['animation-delay-0', 'animation-delay-200', 'animation-delay-400', 'animation-delay-600'];
            return (
              <button
                key={char.id}
                onClick={() => {
                  sounds.playSelect();
                  onSelectAvatar(char.id, char.primaryPath);
                }}
                style={{ backgroundColor: char.color }}
                className={`group relative p-4 border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] transition-all cursor-pointer flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 ${floatDelays[index % 4]}`}
              >
                {/* Badge */}
                <span className="text-xs font-black px-2 py-0.5 bg-white/90 border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
                  {char.badge}
                </span>

                {/* 48x48 Pixel Avatar Container */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white/60 border-2 border-black p-1 shadow-[2px_2px_0px_#000] group-hover:scale-110 transition-transform">
                  <img
                    src={char.primaryPath}
                    alt={char.name}
                    className="pixel-avatar w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    onError={(e) => {
                      // Fallback to embedded base64 if local file not found
                      (e.target as HTMLImageElement).src = char.fallbackDataUri;
                    }}
                  />
                </div>

                {/* Name */}
                <span className="text-lg font-black text-black tracking-wide">
                  {char.name}
                </span>

                {/* Tagline */}
                <span className="text-[11px] font-bold text-gray-700">
                  {char.tagline}
                </span>

                {/* Sparkle touch indicator */}
                <span className="text-xs text-blue-700 font-extrabold group-hover:underline">
                  👉 터치해서 선택!
                </span>
              </button>
            );
          })}
        </div>

        {/* Back / Cancel */}
        <button
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px]"
        >
          뒤로 가기 (이름 다시 고르기)
        </button>
      </div>
    </div>
  );
};
