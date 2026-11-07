import React, { useState, useEffect } from 'react';
import { Student, GameSession, HallOfFameEntry, ScreenState } from './types';
import { sounds } from './soundEngine';
import { TeacherPasswordModal } from './components/TeacherPasswordModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { AvatarSelectModal } from './components/AvatarSelectModal';
import { FishingGameScreen } from './components/FishingGameScreen';
import { ResultScreen } from './components/ResultScreen';
import {
  subscribeLeaderboard,
  subscribeClassAquarium,
  recordGameScore,
  updateClassAquariumCount,
  clearFirestoreLeaderboard
} from './firebaseService';

const DEFAULT_STUDENTS: Student[] = [
  { id: '1', name: '김민준' },
  { id: '2', name: '이서연' },
  { id: '3', name: '박준혁' },
  { id: '4', name: '최아린' },
  { id: '5', name: '정예원' },
  { id: '6', name: '윤해경' },
  { id: '7', name: '강도윤' },
  { id: '8', name: '한지우' }
];

export default function App() {
  // Navigation screen
  const [screen, setScreen] = useState<ScreenState>('SELECTION');

  // Persistence data in localStorage
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
    return DEFAULT_STUDENTS;
  });

  // Default fish count is 0, synchronized with Firestore
  const [classFishCount, setClassFishCount] = useState<number>(0);

  // Real-time Hall of Fame Leaderboard from Firestore
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);
  const [isFirebaseLive, setIsFirebaseLive] = useState<boolean>(true);

  // Current session & active student
  const [selectedStudentForAvatar, setSelectedStudentForAvatar] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [lastRoundScore, setLastRoundScore] = useState<number>(0);

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);

  // Save student list to localStorage
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

  // Handler: Student tile clicked -> open avatar modal
  const handleStudentTileClick = (studentName: string) => {
    sounds.playTap();
    setSelectedStudentForAvatar(studentName);
  };

  // Handler: Avatar selected -> start game
  const handleAvatarSelect = (avatarId: string, avatarImg: string) => {
    if (!selectedStudentForAvatar) return;
    const session: GameSession = {
      studentName: selectedStudentForAvatar,
      avatarId,
      avatarImg
    };
    setCurrentSession(session);
    setSelectedStudentForAvatar(null);
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

  // Handler: Play again with same student
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
    setSelectedStudentForAvatar(null);
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
      {/* 1. SELECTION SCREEN */}
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
                내 이름을 선택하고 함께할 포켓몬을 골라보세요!
              </p>
            </div>
          </div>

          {/* PROMINENT LIVE LEADERBOARD LINK BANNER (Requested: 게임 첫화면에 리더보드를 확인할 수 있도록 링크) */}
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

          {/* Student Name Grid (Class Bulletin Board style) */}
          <div className="w-full max-w-4xl bg-[#15803D] border-8 border-[#78350F] shadow-[10px_10px_0px_#000] p-5 md:p-7 mb-4">
            <div className="flex items-center justify-between border-b-2 border-white/40 pb-2 mb-4">
              <span className="text-white font-black text-sm md:text-base tracking-wide flex items-center gap-1.5">
                <span>🎒</span>
                <span>우리 반 꼬마 낚시꾼 ({students.length}명)</span>
              </span>
              <span className="text-yellow-300 text-xs font-bold">
                👇 내 이름을 터치하세요!
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-h-[360px] overflow-y-auto p-1">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleStudentTileClick(student.name)}
                  className="group relative bg-[#FEF9C3] hover:bg-[#FEF08A] active:bg-[#FDE047] border-4 border-black p-3.5 md:p-4 text-center shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-transform cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <div className="text-xl">🎒</div>
                  <span className="text-base md:text-lg font-black text-black tracking-wide">
                    {student.name}
                  </span>
                  <span className="text-[11px] text-gray-700 font-bold bg-white/70 px-2 py-0.5 border border-black/40">
                    낚시하러 가기
                  </span>
                </button>
              ))}
            </div>
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

      {/* MODAL 1: Avatar Selection */}
      {selectedStudentForAvatar && (
        <AvatarSelectModal
          isOpen={Boolean(selectedStudentForAvatar)}
          studentName={selectedStudentForAvatar}
          onClose={() => setSelectedStudentForAvatar(null)}
          onSelectAvatar={handleAvatarSelect}
        />
      )}

      {/* MODAL 2: Teacher Password Verification */}
      <TeacherPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          setIsTeacherModalOpen(true);
        }}
      />

      {/* MODAL 3: Teacher Settings */}
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
