import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameSession, WordItem, SwimmingFish } from '../types';
import { getRandomWordList } from '../wordData';
import { sounds } from '../soundEngine';
import { CHARACTERS } from '../assets/characterData';
import { formatPraise, formatResultSubject } from '../utils/koreanHelper';

interface FishingGameScreenProps {
  session: GameSession;
  onGameEnd: (finalScore: number) => void;
  onExitGame: () => void;
}

const FISH_COLORS = ['#F97316', '#38BDF8', '#FACC15', '#A855F7', '#EC4899', '#34D399'];

export const FishingGameScreen: React.FC<FishingGameScreenProps> = ({
  session,
  onGameEnd,
  onExitGame
}) => {
  // Game states: 30 seconds timer
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [wordList, setWordList] = useState<WordItem[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [fishes, setFishes] = useState<SwimmingFish[]>([]);
  const [hookedFishId, setHookedFishId] = useState<string | null>(null);
  const [isReelingUp, setIsReelingUp] = useState<boolean>(false);
  const [praiseMessage, setPraiseMessage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted());
  const [hookTarget, setHookTarget] = useState<{ x: number; y: number } | null>(null);
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState<boolean>(false);

  const lakeRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Character metadata
  const character = CHARACTERS.find(c => c.id === session.avatarId) || CHARACTERS[0];

  // Initialize word list on mount & Start BGM
  useEffect(() => {
    const list = getRandomWordList();
    setWordList(list);
    setCurrentWordIndex(0);

    // Start background music
    sounds.startBgm();

    return () => {
      sounds.stopBgm();
    };
  }, []);

  const currentWord = wordList[currentWordIndex] || null;

  // Hint Voice: Read out ONLY the word itself (e.g. "사과") clearly!
  useEffect(() => {
    if (currentWord && !isPaused && !isTimeUpModalOpen) {
      sounds.speakWord(currentWord.word);
    }
  }, [currentWord, currentWordIndex, isPaused, isTimeUpModalOpen]);

  // Spawn swimming fishes for current word
  const spawnFishes = useCallback((word: WordItem) => {
    if (!word) return;

    const chars = [word.targetChar, ...word.distractors.slice(0, 4)];
    const shuffled = chars.sort(() => Math.random() - 0.5);

    const newFishes: SwimmingFish[] = shuffled.map((ch, i) => {
      const isTarget = ch === word.targetChar;
      const direction = (Math.random() > 0.5 ? 1 : -1) as 1 | -1;
      const speed = 0.08 + Math.random() * 0.07;
      const y = 18 + i * 15 + (Math.random() * 6 - 3);

      return {
        id: `fish-${i}-${Date.now()}`,
        char: ch,
        isTarget,
        x: 10 + i * 16,
        y: Math.min(Math.max(y, 16), 84),
        speed,
        direction,
        color: FISH_COLORS[i % FISH_COLORS.length],
        size: 54,
        caught: false,
        wobbling: false
      };
    });

    setFishes(newFishes);
  }, []);

  // Update fishes on word change
  useEffect(() => {
    if (currentWord) {
      spawnFishes(currentWord);
      setHookedFishId(null);
      setIsReelingUp(false);
      setHookTarget(null);
    }
  }, [currentWord, spawnFishes]);

  // 30-second countdown timer
  useEffect(() => {
    if (isPaused || isTimeUpModalOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          sounds.stopBgm();
          sounds.playTimeUp();
          setIsTimeUpModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isTimeUpModalOpen]);

  // Fish swimming physics loop
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (time: number) => {
      const dt = (time - lastTime) / 16.66;
      lastTime = time;

      if (!isPaused && !isTimeUpModalOpen) {
        setFishes(prevFishes =>
          prevFishes.map(f => {
            if (f.caught) return f;

            let newX = f.x + f.direction * f.speed * dt;
            let newDir = f.direction;

            if (newX > 88) {
              newX = 88;
              newDir = -1;
            } else if (newX < 6) {
              newX = 6;
              newDir = 1;
            }

            return {
              ...f,
              x: newX,
              direction: newDir
            };
          })
        );
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, isTimeUpModalOpen]);

  // Touch Interaction:
  // Lift the letter fish up to the boat FIRST, then show praise modal with given name!
  const handleFishTouch = (fish: SwimmingFish) => {
    if (hookedFishId || isPaused || timeLeft <= 0 || isTimeUpModalOpen) return;

    if (fish.isTarget) {
      // 1. Hook cast down to fish
      sounds.playCast();
      setHookedFishId(fish.id);
      setHookTarget({ x: fish.x, y: fish.y });

      // 2. Reeling UP to boat
      setTimeout(() => {
        sounds.playSplash();
        setIsReelingUp(true);
        setFishes(prev =>
          prev.map(f => (f.id === fish.id ? { ...f, caught: true, x: 54, y: 5 } : f))
        );
        setHookTarget({ x: 54, y: 5 });
      }, 250);

      // 3. ONLY AFTER fish is lifted into the boat (~850ms), show encouragement modal with given name!
      setTimeout(() => {
        sounds.playCorrect();
        const newScore = score + 1;
        setScore(newScore);
        // e.g. "도리야 축하해! 🎉 '사과' 완성!" or "민준아 축하해! 🎉 '사과' 완성!"
        setPraiseMessage(formatPraise(session.studentName, currentWord?.word || '단어'));
        if (currentWord) {
          sounds.speakWord(currentWord.word);
        }
      }, 850);

      // 4. Transition to next word after praise
      setTimeout(() => {
        setPraiseMessage(null);
        setHookedFishId(null);
        setIsReelingUp(false);
        setHookTarget(null);
        setCurrentWordIndex(prev => (prev + 1) % wordList.length);
      }, 2100);
    } else {
      // Wrong fish feedback: play gentle sound + voice guidance "'{char}', 다시 찾아보자"
      sounds.playWrong();
      sounds.speakPhrase(`${fish.char}, 다시 찾아보자`);
      setFishes(prev =>
        prev.map(f => {
          if (f.id === fish.id) {
            return {
              ...f,
              wobbling: true,
              direction: (f.direction * -1) as 1 | -1,
              x: Math.max(8, Math.min(84, f.x + (f.direction * -1) * 12))
            };
          }
          return f;
        })
      );

      setTimeout(() => {
        setFishes(prev =>
          prev.map(f => (f.id === fish.id ? { ...f, wobbling: false } : f))
        );
      }, 550);
    }
  };

  const toggleSound = () => {
    const nextMute = !isMuted;
    sounds.setMuted(nextMute);
    setIsMuted(nextMute);
    if (!nextMute) sounds.playTap();
  };

  const handlePauseToggle = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    if (nextPaused) {
      sounds.pauseBgm();
    } else {
      sounds.resumeBgm();
    }
  };

  // Immediate exit to first screen without getting stuck
  const handleExitClick = () => {
    sounds.playTap();
    sounds.stopBgm();
    onExitGame();
  };

  const repeatWordVoice = () => {
    sounds.playTap();
    if (currentWord) {
      sounds.speakWord(currentWord.word);
    }
  };

  return (
    <div className="relative w-full h-screen max-h-screen overflow-hidden flex flex-col bg-slate-900 select-none">
      {/* ================= TOP HUD CLUSTER ================= */}
      <header className="relative z-30 flex items-center justify-between px-3 py-2 bg-[#FEF08A] border-b-4 border-black shadow-[0_4px_0_#000]">
        {/* Student & Avatar Badge */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
          <div className="w-8 h-8 flex items-center justify-center bg-sky-100 border border-black p-0.5">
            <img
              src={session.avatarImg}
              alt={character.name}
              className="pixel-avatar w-7 h-7 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = character.fallbackDataUri;
              }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-gray-600 font-bold">{character.name} 낚시꾼</span>
            <span className="text-sm font-black text-black">{session.studentName}</span>
          </div>
        </div>

        {/* 30s Timer Bar & Digit */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
          <span className="text-xs font-black text-gray-700">⏰ 남은 시간</span>
          <div className="w-20 md:w-32 h-4 bg-gray-200 border border-black overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 ${
                timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
          <span
            className={`font-mono font-black text-sm tabular-nums ${
              timeLeft <= 5 ? 'text-red-600 animate-bounce' : 'text-black'
            }`}
          >
            {timeLeft}초
          </span>
        </div>

        {/* Fish Catch Score */}
        <div className="flex items-center gap-1.5 bg-[#BBF7D0] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
          <span className="text-base">🐟</span>
          <span className="text-xs font-bold text-gray-800">잡은 물고기</span>
          <span className="text-base font-black text-black font-mono tabular-nums">{score}마리</span>
        </div>

        {/* Utility Buttons: Exit directly returns to first screen */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 border-2 border-black shadow-[2px_2px_0px_#000] text-sm cursor-pointer"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={handlePauseToggle}
            className="px-2.5 py-1 bg-amber-300 hover:bg-amber-400 font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            {isPaused ? '▶ 계속' : '⏸ 멈춤'}
          </button>
          <button
            onClick={handleExitClick}
            className="px-2.5 py-1 bg-rose-400 hover:bg-rose-500 font-black text-xs text-white border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            title="첫 화면으로 돌아가기"
          >
            나가기
          </button>
        </div>
      </header>

      {/* ================= SPLIT VIEW: UPPER (SURFACE) ================= */}
      <div className="relative w-full h-[40%] bg-gradient-to-b from-[#60A5FA] via-[#93C5FD] to-[#38BDF8] overflow-hidden border-b-4 border-black">
        {/* Pixel Clouds */}
        <div className="absolute top-3 left-8 w-20 h-7 bg-white/90 rounded-none shadow-[2px_2px_0px_#000] opacity-90" />
        <div className="absolute top-6 right-16 w-24 h-8 bg-white/90 rounded-none shadow-[2px_2px_0px_#000] opacity-90" />
        <div className="absolute top-2 left-1/2 w-16 h-6 bg-white/80 rounded-none shadow-[2px_2px_0px_#000] opacity-80" />

        {/* Forest Silhouette */}
        <div className="absolute bottom-6 left-0 right-0 h-16 flex items-end justify-between px-2 pointer-events-none opacity-90">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ transform: `scale(${0.8 + (i % 3) * 0.15})` }}
            >
              <div className="w-8 h-8 bg-[#15803D] border-2 border-black shadow-[2px_2px_0px_#000] rotate-45 mb-[-12px]" />
              <div className="w-10 h-10 bg-[#166534] border-2 border-black shadow-[2px_2px_0px_#000] rotate-45 mb-[-8px]" />
              <div className="w-3 h-5 bg-[#78350F] border-x-2 border-black" />
            </div>
          ))}
        </div>

        {/* Water Ripple Line */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0284C7] border-t-2 border-white/60 flex items-center justify-around overflow-hidden">
          <div className="w-full h-1 bg-white/40 animate-pulse" />
        </div>

        {/* Central Wooden Fishing Boat & Pokemon Avatar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 boat-bobbing">
          <div className="relative flex items-end">
            <div className="relative -mr-2 mb-1 z-10">
              <img
                src={session.avatarImg}
                alt={character.name}
                className="pixel-avatar w-14 h-14 sm:w-16 sm:h-16 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = character.fallbackDataUri;
                }}
              />
            </div>

            {/* Retro Pixel Fishing Rod */}
            <div className="relative w-14 h-16 origin-bottom-left rotate-[-25deg] mb-2 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-1.5 h-16 bg-[#B45309] border border-black" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 border border-black" />
            </div>
          </div>

          {/* Wooden Boat Hull */}
          <div className="relative w-36 sm:w-44 h-8 bg-[#92400E] border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center">
            <div className="w-full h-full flex divide-x-2 divide-black/40">
              <div className="flex-1 bg-[#B45309]" />
              <div className="flex-1 bg-[#92400E]" />
              <div className="flex-1 bg-[#78350F]" />
              <div className="flex-1 bg-[#B45309]" />
            </div>
            <span className="absolute text-[10px] font-black text-yellow-200 bg-black/60 px-2 py-0.5 border border-yellow-400/80">
              {session.studentName}호
            </span>
          </div>
        </div>

        {/* Dynamic Fishing Line In Sky */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
          <line
            x1="54%"
            y1="55%"
            x2={hookTarget ? `${hookTarget.x}%` : '54%'}
            y2="100%"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
        </svg>

        {/* Word Clue Card (Centered in Sky) */}
        {currentWord && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="bg-[#FFFBEB] border-4 border-black shadow-[5px_5px_0px_#000] px-4 py-2 flex items-center gap-3">
              <span className="text-3xl md:text-4xl">{currentWord.emoji}</span>

              {/* Syllable Boxes: Solid, steady, no flickering */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-3 border-black text-2xl md:text-3xl font-black ${
                    currentWord.missingIndex === 0
                      ? 'bg-[#FEF08A] text-amber-900 border-black'
                      : 'bg-white text-black'
                  }`}
                >
                  {currentWord.missingIndex === 0 ? '?' : currentWord.givenChar}
                </div>

                <div
                  className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-3 border-black text-2xl md:text-3xl font-black ${
                    currentWord.missingIndex === 1
                      ? 'bg-[#FEF08A] text-amber-900 border-black'
                      : 'bg-white text-black'
                  }`}
                >
                  {currentWord.missingIndex === 1 ? '?' : currentWord.givenChar}
                </div>
              </div>

              <button
                onClick={repeatWordVoice}
                className="w-10 h-10 flex items-center justify-center bg-yellow-300 hover:bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000] text-lg active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="단어 소리 다시 듣기"
              >
                📢
              </button>
            </div>

            <div className="mt-1 bg-black text-yellow-300 px-3 py-0.5 text-xs font-bold shadow-[2px_2px_0px_#000]">
              물속에서 <span className="text-white font-black underline">'{currentWord.targetChar}'</span> 물고기를 낚아줘! 🎣
            </div>
          </div>
        )}
      </div>

      {/* ================= SPLIT VIEW: LOWER (UNDERWATER LAKE) ================= */}
      <div
        ref={lakeRef}
        className="relative w-full h-[60%] bg-gradient-to-b from-[#0369A1] via-[#075985] to-[#082F49] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-cyan-400 to-transparent" />

        {/* Ambient Bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/40 border border-white/60 rounded-full animate-bubble"
              style={{
                width: `${8 + (i % 4) * 6}px`,
                height: `${8 + (i % 4) * 6}px`,
                left: `${(i * 9 + 4) % 96}%`,
                bottom: '-20px',
                animationDelay: `${(i * 0.7) % 5}s`,
                animationDuration: `${4 + (i % 3) * 2}s`
              }}
            />
          ))}
        </div>

        {/* Seaweed & Lakebed Flora at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#B45309] border-t-4 border-[#78350F] flex items-end justify-between px-3 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="seaweed-sway origin-bottom"
              style={{ animationDelay: `${(i * 0.4) % 3}s` }}
            >
              <div
                className="w-3 bg-emerald-600 border-x border-t border-black"
                style={{ height: `${28 + (i % 5) * 10}px` }}
              />
            </div>
          ))}
        </div>

        {/* Dynamic Fishing Hook Line In Lake */}
        {hookTarget && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
            <line
              x1="54%"
              y1="0%"
              x2={`${hookTarget.x}%`}
              y2={`${hookTarget.y}%`}
              stroke="#F8FAFC"
              strokeWidth="2.5"
              strokeDasharray="3 3"
            />
            <circle cx={`${hookTarget.x}%`} cy={`${hookTarget.y}%`} r="5" fill="#EF4444" stroke="#000" strokeWidth="2" />
          </svg>
        )}

        {/* Swimming Fish Entities */}
        {fishes.map((fish) => {
          const isHooked = fish.id === hookedFishId;
          return (
            <button
              key={fish.id}
              onClick={() => handleFishTouch(fish)}
              disabled={hookedFishId !== null || isPaused || isTimeUpModalOpen}
              style={{
                left: isReelingUp && isHooked ? '54%' : `${fish.x}%`,
                top: isReelingUp && isHooked ? '2%' : `${fish.y}%`,
                transform: `translate(-50%, -50%) ${
                  fish.direction === 1 ? 'scaleX(1)' : 'scaleX(-1)'
                } ${fish.wobbling ? 'rotate(15deg) scale(1.15)' : ''} ${
                  isHooked ? 'scale(1.25)' : ''
                }`,
                transition: isReelingUp && isHooked
                  ? 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                  : isHooked
                  ? 'transform 0.15s ease'
                  : fish.wobbling
                  ? 'transform 0.15s ease-in-out'
                  : 'none'
              }}
              className={`absolute z-20 group cursor-pointer focus:outline-none select-none transition-transform active:scale-95`}
            >
              <div className="relative flex items-center justify-center p-1">
                <svg
                  width="72"
                  height="44"
                  viewBox="0 0 72 44"
                  className="drop-shadow-[3px_3px_0px_#000]"
                >
                  <ellipse cx="38" cy="22" rx="26" ry="17" fill={fish.color} stroke="#000" strokeWidth="3" />
                  <polygon
                    points="6,7 18,22 6,37"
                    fill={fish.color}
                    stroke="#000"
                    strokeWidth="3"
                  />
                  <path d="M 28 6 Q 38 0 46 6 Z" fill="#FEF08A" stroke="#000" strokeWidth="2" />
                  <circle cx="53" cy="18" r="4" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
                  <circle cx="54" cy="18" r="2" fill="#000000" />
                  <ellipse cx="48" cy="26" rx="3.5" ry="2" fill="#F43F5E" opacity="0.8" />
                  <path d="M 59 22 Q 62 25 58 27" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                </svg>

                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    transform: fish.direction === 1 ? 'none' : 'scaleX(-1)'
                  }}
                >
                  <span className="w-9 h-9 flex items-center justify-center bg-white border-2 border-black font-black text-xl md:text-2xl text-black shadow-[2px_2px_0px_#000]">
                    {fish.char}
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Praise Overlay Modal with given name (e.g. "도리야 축하해! 🎉 '사과' 완성!") */}
        {praiseMessage && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in zoom-in-95 duration-200">
            <div className="bg-[#FEF08A] border-4 border-black shadow-[8px_8px_0px_#000] p-6 text-center max-w-sm mx-4">
              <div className="text-4xl mb-2 animate-bounce">🎣 ✨</div>
              <h3 className="text-xl md:text-2xl font-black text-black mb-1">
                {praiseMessage}
              </h3>
              <p className="text-xs font-bold text-gray-700">
                +1점 획득! 다음 단어로 출발! 🚀
              </p>
            </div>
          </div>
        )}

        {/* Pause Modal Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6 text-center max-w-xs">
              <div className="text-3xl mb-2">⏸️</div>
              <h3 className="text-lg font-black text-black mb-3">게임이 멈췄어요!</h3>
              <button
                onClick={handlePauseToggle}
                className="w-full py-2 bg-[#4ADE80] font-black text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                ▶ 계속 낚시하기
              </button>
            </div>
          </div>
        )}

        {/* Time's Up Modal with given name and "낚시 끝내기" button */}
        {isTimeUpModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full max-w-md bg-[#FFFBEB] border-4 border-black shadow-[10px_10px_0px_#000] p-6 md:p-8 text-center mx-4">
              <div className="text-5xl mb-3 animate-bounce">⏰ 🎣</div>
              <h2 className="text-2xl md:text-3xl font-black text-black mb-2">
                낚시 시간이 끝났어요!
              </h2>
              <p className="text-sm md:text-base font-bold text-gray-800 mb-6 bg-[#FEF08A] border-2 border-black py-2.5 px-3 shadow-[2px_2px_0px_#000]">
                <span className="text-blue-600 font-black">{formatResultSubject(session.studentName)}</span>{' '}
                <span className="text-red-600 font-black font-mono text-lg">{score}마리</span>의 글자 물고기를 낚았어요!
              </p>
              <button
                onClick={() => {
                  sounds.playTap();
                  onGameEnd(score);
                }}
                className="w-full py-3.5 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-black text-lg border-4 border-black shadow-[5px_5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🎣</span>
                <span>낚시 끝내기 (결과 보러 가기) 👉</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
