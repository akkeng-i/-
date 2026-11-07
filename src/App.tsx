import React, { useState, useEffect } from 'react';
import { GameSession, HallOfFameEntry, ScreenState, Student } from './types';
import { sounds } from './soundEngine';
import { CHARACTERS } from './assets/characterData';
import { TeacherPasswordModal } from './components/TeacherPasswordModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { FishingGameScreen } from './components/FishingGameScreen';
import { ResultScreen } from './components/ResultScreen';
import {
  subscribeLeaderboard,
  subscribeClassAquarium,
  recordGameScore,
  updateClassAquariumCount,
  clearFirestoreLeaderboard
} from './firebaseService';

const DEFAULT_RECENT_NAMES = [
  '김민준', '이서연', '박준혁', '최아린', '정예원', '윤해경', '강도윤', '한지우'
];

export default function App() {
  // Navigation screen
  const [screen, setScreen] = useState<ScreenState>('SELECTION');

  // Direct Name Input & Pokemon Selection
  const [inputName, setInputName] = useState<string>(() => {
    return localStorage.getItem('LAST_STUDENT_NAME') || '';
  });
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('pikachu');

  // Quick name chips (convenience for repeated plays)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('STUDENT_LIST');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            return (parsed as unknown as string[]).map((name, i) => ({ id: `${i}`, name }));
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_RECENT_NAMES.map((name, i) => ({ id: `${i}`, name }));
  });

  // Default fish count is 0, synchronized with Firestore
  const [classFishCount, setClassFishCount] = useState<number>(0);

  // Real-time Hall of Fame Leaderboard from Firestore
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);
  const [isFirebaseLive, setIsFirebaseLive] = useState<boolean>(true);

  // Active game session
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [lastRoundScore, setLastRoundScore] = useState<number>(0);

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);

  // Save student chips to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('STUDENT_LIST', JSON.stringify(students.map(s => s.name)));
    } catch {
      // Ignore
    }
  }, [students]);

  // Connect to Google Firestore Real-Time Database (Leaderboard & Cooperative Aquarium)
  useEffect(() => {
    const unsubLeaderboard = subscribeLeaderboard(
      (entries) => {
        setHallOfFame(entries);
        setIsFirebaseLive(true);
      },
      () => {
        setIsFirebaseLive(false);
      }
    );

    const unsubAquarium = subscribeClassAquarium(
      (totalCount) => {
        setClassFishCount(totalCount);
        setIsFirebaseLive(true);
      },
      () => {
        setIsFirebaseLive(false);
      }
    );

    return () => {
      unsubLeaderboard();
      unsubAquarium();
    };
  }, []);

  // Handler: Start Game with direct name and selected character
  const handleStartGame = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;

    sounds.playTap();
    const character = CHARACTERS.find(c => c.id === selectedAvatarId) || CHARACTERS[0];
    const session: GameSession = {
      studentName: trimmed,
      avatarId: character.id,
      avatarImg: character.primaryPath
    };

    // Remember name for next time and add to quick chips if new
    try {
      localStorage.setItem('LAST_STUDENT_NAME', trimmed);
      if (!students.some(s => s.name === trimmed)) {
        const newChip: Student = { id: Date.now().toString(), name: trimmed };
        setStudents(prev => [newChip, ...prev].slice(0, 16));
      }
    } catch {
      // Ignore
    }

    setCurrentSession(session);
    setScreen('PLAYING');
  };

  // Handler: Game finished (30 seconds elapsed) -> Save to Google Firestore
  const handleGameEnd = async (finalScore: number) => {
    setLastRoundScore(finalScore);

    if (currentSession) {
      try {
        await recordGameScore(
          currentSession.studentName,
          finalScore,
          currentSession.avatarId,
          currentSession.avatarImg
        );
      } catch (err) {
        console.error('Failed to record score to Firestore:', err);
      }
    }

    setScreen('RESULT');
  };

  // Handler: Play again with same student & character
  const handlePlayAgain = () => {
    if (currentSession) {
      setScreen('PLAYING');
    } else {
      setScreen('SELECTION');
    }
  };

  // Handler: Switch student / Return to selection
  const handleChangeStudent = () => {
    setCurrentSession(null);
    setScreen('SELECTION');
  };

  // Handler: Reset Hall of Fame immediately in Firestore & local state
  const handleResetLeaderboard = async () => {
    setHallOfFame([]);
    try {
      await clearFirestoreLeaderboard();
      localStorage.setItem('FISHING_HALL_OF_FAME', JSON.stringify([]));
    } catch (err) {
      console.error('Failed to reset Firestore leaderboard:', err);
    }
  };

  // Handler: Update Classroom Aquarium fish count in Firestore
  const handleUpdateClassFishCount = async (count: number) => {
    setClassFishCount(count);
    try {
      await updateClassAquariumCount(count);
      localStorage.setItem('CLASS_FISH_COUNT', count.toString());
    } catch (err) {
      console.error('Failed to update class aquarium in Firestore:', err);
    }
  };

  // Screen rendering
  return (
    <div className="w-full min-h-screen bg-[#E0F2FE] flex flex-col select-none">
      {/* 1. SELECTION SCREEN: 이름 직접 입력 + 캐릭터 선택 */}
      {screen === 'SELECTION' && (
        <div className="flex-1 flex flex-col items-center justify-between p-4 md:p-6 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#BBF7D0]">
          {/* Top Bar with Live Leaderboard & Teacher Settings */}
          <header className="w-full max-w-4xl flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl">🌲</span>
              {isFirebaseLive && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-0.5 border border-emerald-600 shadow-[1px_1px_0px_#000]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Firestore 실시간 연결</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* 명예의 전당 결과보드 버튼 */}
              <button
                onClick={() => {
                  sounds.playTap();
                  setScreen('RESULT');
                }}
                className="px-3.5 py-1.5 bg-[#FEF08A] hover:bg-[#FDE047] text-black font-black text-xs md:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
                title="명예의 전당 & 수족관 결과보드 보기"
              >
                <span>🏆</span>
                <span>명예의 전당</span>
              </button>

              {/* 교사 설정 (비밀번호 확인 후 진입) */}
              <button
                onClick={() => {
                  sounds.playTap();
                  setIsPasswordModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-black font-black text-xs md:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
              >
                <span>⚙️</span>
                <span>교사 설정</span>
              </button>
            </div>
          </header>

          {/* Title Banner */}
          <div className="w-full max-w-2xl text-center mb-3">
            <div className="inline-block bg-[#FEF9C3] border-4 border-black px-6 py-3 shadow-[6px_6px_0px_#000] mb-2">
              <h1 className="text-2xl md:text-4xl font-black text-black tracking-tight flex items-center justify-center gap-2">
                <span>🎣</span>
                <span>숲속 글자 낚시꾼</span>
                <span>🐟</span>
              </h1>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-800 bg-white/90 inline-block px-4 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                내 이름을 입력하고 함께할 포켓몬을 골라보세요!
              </p>
            </div>
          </div>

          {/* PROMINENT LIVE LEADERBOARD LINK BANNER */}
          <div className="w-full max-w-4xl bg-gradient-to-r from-[#FEF08A] via-[#FDE047] to-[#FEF08A] border-4 border-black p-3.5 shadow-[5px_5px_0px_#000] mb-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-black text-black">
                    실시간 숲속 낚시왕 리더보드
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000] animate-pulse">
                    LIVE 실시간 연동
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-800 mt-0.5">
                  우리 반 친구들의 1~5등 명예의 전당 기록과 실시간 물고기 수를 확인해보세요!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                setScreen('RESULT');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-black text-xs md:text-sm border-3 border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>👑</span>
              <span>리더보드 보러가기 👉</span>
            </button>
          </div>

          {/* MAIN INTERACTIVE CARD: 1. 이름 입력 + 2. 포켓몬 선택 + 3. 출발 버튼 */}
          <div className="w-full max-w-4xl bg-[#15803D] border-8 border-[#78350F] shadow-[10px_10px_0px_#000] p-4 md:p-6 mb-4 space-y-4">
            {/* Step 1: Name Input */}
            <div className="bg-[#FEF9C3] border-4 border-black p-4 shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm md:text-base font-black text-black flex items-center gap-1.5">
                  <span>✏️</span>
                  <span>1. 꼬마 낚시꾼 이름 입력</span>
                </label>
                <span className="text-xs text-gray-600 font-bold">최대 8글자</span>
              </div>

              <input
                type="text"
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                placeholder="내 이름을 입력해주세요 (예: 김민준, 이서연)"
                maxLength={8}
                className="w-full text-center font-black text-xl md:text-2xl bg-white border-4 border-black p-3 shadow-[3px_3px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-base"
              />

              {/* Quick Select Chips */}
              {students.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-black/20">
                  <span className="text-[11px] font-bold text-gray-700 block mb-1">
                    👇 터치해서 바로 입력하기:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-0.5">
                    {students.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setInputName(s.name);
                        }}
                        className={`px-2.5 py-1 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors ${
                          inputName === s.name ? 'bg-yellow-400 text-black' : 'bg-white hover:bg-yellow-100 text-gray-800'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Companion Pokemon Avatar Selection */}
            <div className="bg-[#FEF9C3] border-4 border-black p-4 shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm md:text-base font-black text-black flex items-center gap-1.5">
                  <span>🌟</span>
                  <span>2. 함께할 포켓몬 고르기</span>
                </span>
                <span className="text-xs text-blue-700 font-bold">마음에 드는 포켓몬을 터치하세요!</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CHARACTERS.map(c => {
                  const isSelected = selectedAvatarId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        sounds.playSelect();
                        setSelectedAvatarId(c.id);
                      }}
                      style={{ backgroundColor: isSelected ? c.color : '#FFFFFF' }}
                      className={`relative border-4 border-black p-3 flex flex-col items-center justify-between gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-4 ring-yellow-400 shadow-[6px_6px_0px_#000] scale-102'
                          : 'opacity-85 hover:opacity-100 shadow-[3px_3px_0px_#000] hover:scale-101'
                      }`}
                    >
                      <span className="text-xs font-black px-2 py-0.5 bg-white/90 border-2 border-black shadow-[1px_1px_0px_#000]">
                        {c.badge}
                      </span>

                      <div className="w-16 h-16 flex items-center justify-center bg-white/80 border-2 border-black p-1 shadow-[2px_2px_0px_#000]">
                        <img
                          src={c.primaryPath}
                          alt={c.name}
                          className="pixel-avatar w-12 h-12 object-contain"
                          onError={e => {
                            (e.target as HTMLImageElement).src = c.fallbackDataUri;
                          }}
                        />
                      </div>

                      <div className="text-center">
                        <span className="text-sm font-black text-black block">{c.name}</span>
                        {isSelected ? (
                          <span className="text-[10px] font-black text-red-600 bg-white px-2 py-0.5 border border-black inline-block mt-0.5">
                            선택됨 ✨
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-bold">선택하기</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Start Game Button */}
            <button
              type="button"
              onClick={handleStartGame}
              disabled={!inputName.trim()}
              className={`w-full py-4 text-center font-black text-base md:text-xl border-4 border-black shadow-[6px_6px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                inputName.trim()
                  ? 'bg-[#4ADE80] hover:bg-[#22C55E] text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] animate-pulse'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
              }`}
            >
              <span>🎣</span>
              <span>
                {inputName.trim()
                  ? `${inputName.trim()} 친구와 함께 낚시하러 출발! 👉`
                  : '이름을 입력하고 낚시를 시작해보세요!'}
              </span>
              <span>🐟</span>
            </button>
          </div>

          {/* Cooperative Aquarium Banner Footer */}
          <div className="w-full max-w-4xl bg-white border-4 border-black p-3 shadow-[5px_5px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌊</span>
              <div>
                <span className="text-xs text-gray-500 font-bold block">우리 반 협동 수족관 (실시간 클라우드)</span>
                <span className="text-sm font-black text-black">
                  오늘 잡은 물고기: <span className="text-blue-600 font-mono font-black">{classFishCount}</span> / 200 마리 🐟
                </span>
              </div>
            </div>

            <div className="w-full sm:w-64 h-5 bg-sky-100 border-2 border-black overflow-hidden relative">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((classFishCount / 200) * 100))}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-black drop-shadow">
                {Math.min(100, Math.round((classFishCount / 200) * 100))}% 달성
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLAYING SCREEN */}
      {screen === 'PLAYING' && currentSession && (
        <FishingGameScreen
          session={currentSession}
          onGameEnd={handleGameEnd}
          onExitGame={handleChangeStudent}
        />
      )}

      {/* 3. RESULT / HALL OF FAME SCREEN */}
      {screen === 'RESULT' && (
        <ResultScreen
          session={currentSession}
          score={lastRoundScore}
          classFishCount={classFishCount}
          hallOfFame={hallOfFame}
          onPlayAgain={handlePlayAgain}
          onChangeStudent={handleChangeStudent}
        />
      )}

      {/* MODAL 1: Teacher Password Verification */}
      <TeacherPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          setIsTeacherModalOpen(true);
        }}
      />

      {/* MODAL 2: Teacher Settings */}
      <TeacherSettingsModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        students={students}
        onUpdateStudents={setStudents}
        classFishCount={classFishCount}
        onUpdateClassFishCount={handleUpdateClassFishCount}
        onResetLeaderboard={handleResetLeaderboard}
      />
    </div>
  );
}
