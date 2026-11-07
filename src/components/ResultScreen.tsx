import React, { useEffect, useState } from 'react';
import { GameSession, HallOfFameEntry } from '../types';
import { sounds } from '../soundEngine';
import { CHARACTERS } from '../assets/characterData';
import { formatResultSubject } from '../utils/koreanHelper';

interface ResultScreenProps {
  session: GameSession | null;
  score: number;
  classFishCount: number;
  hallOfFame: HallOfFameEntry[];
  onPlayAgain: () => void;
  onChangeStudent: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  session,
  score,
  classFishCount,
  hallOfFame,
  onPlayAgain,
  onChangeStudent
}) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const isGoalReached = classFishCount >= 200;

  useEffect(() => {
    // Play fanfare if goal is reached or round just completed
    if (isGoalReached) {
      setShowConfetti(true);
      sounds.playTrophyFanfare();
    } else if (session) {
      sounds.playCorrect();
    }
  }, [isGoalReached, session]);

  const character = session
    ? CHARACTERS.find(c => c.id === session.avatarId) || CHARACTERS[0]
    : CHARACTERS[0];

  const progressPercent = Math.min(100, Math.round((classFishCount / 200) * 100));

  return (
    <div className="relative min-h-screen bg-[#E0F2FE] p-4 md:p-6 flex flex-col items-center justify-center overflow-x-hidden">
      {/* Full-Screen Confetti & Fireworks if 200 Fish Goal Reached */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-none animate-confetti"
              style={{
                left: `${(i * 2) % 100}%`,
                top: `-20px`,
                backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'][i % 6],
                animationDelay: `${(i * 0.1) % 3}s`,
                animationDuration: `${2.5 + (i % 3) * 0.7}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-5xl space-y-4 my-auto">
        {/* Title Lockup */}
        <div className="flex items-center justify-between gap-4 mb-1">
          <button
            onClick={() => {
              sounds.playTap();
              onChangeStudent();
            }}
            className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-black font-black text-xs md:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
          >
            <span>←</span>
            <span>첫 화면으로</span>
          </button>

          <div className="inline-block bg-[#FEF08A] border-4 border-black px-5 py-1.5 shadow-[5px_5px_0px_#000]">
            <h1 className="text-xl md:text-2xl font-black text-black tracking-tight flex items-center gap-2">
              <span>🏆</span>
              <span>명예의 전당 & 우리 반 협동 수족관</span>
              <span>🐟</span>
            </h1>
          </div>

          <div className="w-20 hidden sm:block"></div>
        </div>

        {/* 2-Column Horizontal Split Layout: 좌측(수족관, 오늘 멋진 낚시꾼) / 우측(명예의 전당) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* ================= LEFT COLUMN ================= */}
          <div className="flex flex-col gap-4">
            {/* 1. 반 전체 협동 수족관 (Cooperative Class Aquarium) */}
            <section className="bg-white border-4 border-black p-4 md:p-5 shadow-[5px_5px_0px_#000] flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌊</span>
                    <h2 className="text-base md:text-lg font-black text-black">
                      우리 반이 잡은 물고기 수족관
                    </h2>
                  </div>
                  <span className="text-sm font-black bg-sky-100 border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000]">
                    🐟 <span className="font-mono text-blue-700 tabular-nums">{classFishCount}</span> / 200 마리
                  </span>
                </div>

                {/* Progress Bar with Swimming Fish */}
                <div className="relative w-full h-8 bg-sky-50 border-3 border-black overflow-hidden shadow-inner my-2">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      isGoalReached
                        ? 'bg-gradient-to-r from-emerald-400 via-yellow-400 to-amber-500'
                        : 'bg-gradient-to-r from-sky-400 to-blue-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />

                  {/* Pixel Fish on the bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 text-sm transition-all duration-1000 pointer-events-none"
                    style={{
                      left: `calc(${Math.min(94, Math.max(3, progressPercent))}% - 14px)`
                    }}
                  >
                    🐟
                  </div>

                  {/* Percentage label in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-black text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                      {progressPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Goal Status Message */}
              {isGoalReached ? (
                <div className="mt-2 bg-[#FEF08A] border-2 border-black p-2.5 text-center shadow-[3px_3px_0px_#000] animate-bounce">
                  <span className="text-sm md:text-base font-black text-red-600">
                    🎉 200마리 목표 달성! 우리 반 협동 수족관 대성공! 🏆
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-right text-xs font-bold text-gray-500">
                  목표 200마리까지 앞으로{' '}
                  <span className="font-black text-blue-600">{Math.max(0, 200 - classFishCount)}마리</span> 남았어요! 💪
                </p>
              )}
            </section>

            {/* 2. 오늘의 멋진 낚시꾼 (Current Session Score Card with given name) */}
            {session ? (
              <section className="bg-[#FEF9C3] border-4 border-black p-4 shadow-[5px_5px_0px_#000] flex flex-col justify-between">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 flex items-center justify-center bg-white border-3 border-black shadow-[2px_2px_0px_#000] p-1">
                      <img
                        src={session.avatarImg}
                        alt={character.name}
                        className="pixel-avatar w-11 h-11 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = character.fallbackDataUri;
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gray-600">오늘의 멋진 낚시꾼</span>
                      <h3 className="text-lg md:text-xl font-black text-black leading-tight">
                        {session.studentName} ({character.name})
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white border-3 border-black px-4 py-1.5 shadow-[3px_3px_0px_#000] text-center">
                    <span className="text-xl md:text-2xl font-black text-blue-600 font-mono tabular-nums">
                      {score}마리! 🎣
                    </span>
                  </div>
                </div>

                {/* Subject phrase with given name (e.g. "도리는 오늘 ~" or "민준이는 오늘 ~") */}
                <div className="bg-white/80 border-2 border-black p-2 text-center text-xs md:text-sm font-bold text-gray-800 shadow-[2px_2px_0px_#000]">
                  <span className="text-blue-600 font-black">{formatResultSubject(session.studentName)}</span>{' '}
                  글자 물고기 <span className="font-black text-red-600 font-mono">{score}마리</span>를 멋지게 낚았어요!
                </div>
              </section>
            ) : (
              <section className="bg-[#FEF9C3] border-4 border-black p-4 shadow-[5px_5px_0px_#000] text-center space-y-2">
                <div className="text-2xl">🎒</div>
                <h3 className="text-base font-black text-black">나도 숲속 낚시왕에 도전해볼까요?</h3>
                <p className="text-xs font-bold text-gray-700">
                  내 이름을 선택하고 좋아하는 포켓몬과 함께 글자 물고기를 낚아보세요!
                </p>
              </section>
            )}
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          {/* 3. 숲속 낚시왕 픽셀 명예의 전당 (Leaderboard) */}
          <section className="bg-white border-4 border-black p-4 md:p-5 shadow-[5px_5px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-3 border-black pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👑</span>
                  <h2 className="text-base md:text-lg font-black text-black">
                    숲속 낚시왕 명예의 전당
                  </h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 border border-emerald-600 shadow-[1px_1px_0px_#000]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>실시간 LIVE</span>
                  </span>
                  <span className="text-xs text-gray-500 font-bold hidden sm:inline">우리 반 TOP 5</span>
                </div>
              </div>

              {hallOfFame.length === 0 ? (
                <div className="py-8 px-4 text-center border-2 border-dashed border-gray-300 bg-gray-50 space-y-2 my-2">
                  <span className="text-3xl block">⭐</span>
                  <p className="text-sm font-black text-gray-700">아직 등록된 낚시왕 기록이 없습니다.</p>
                  <p className="text-xs font-bold text-gray-500">
                    지금 낚시를 시작해 첫 번째 1등 왕관의 주인공이 되어보세요! 🎣
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {hallOfFame.slice(0, 5).map((entry, index) => {
                    let medalIcon = '⭐';
                    let badgeBg = 'bg-gray-100';
                    if (index === 0) {
                      medalIcon = '👑';
                      badgeBg = 'bg-[#FEF08A]';
                    } else if (index === 1) {
                      medalIcon = '🥈';
                      badgeBg = 'bg-slate-200';
                    } else if (index === 2) {
                      medalIcon = '🥉';
                      badgeBg = 'bg-amber-100';
                    }

                    const entryChar = CHARACTERS.find(c => c.id === entry.avatarId) || CHARACTERS[index % 4];

                    return (
                      <div
                        key={entry.id || index}
                        className={`flex items-center justify-between p-2.5 border-2 border-black ${badgeBg} shadow-[2px_2px_0px_#000]`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl font-black w-6 text-center">{medalIcon}</span>
                          <span className="text-xs font-black text-gray-700 font-mono">{index + 1}등</span>
                          <div className="w-8 h-8 flex items-center justify-center bg-white border border-black p-0.5">
                            <img
                              src={entry.avatarImg || entryChar.primaryPath}
                              alt={entryChar.name}
                              className="pixel-avatar w-6 h-6 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = entryChar.fallbackDataUri;
                              }}
                            />
                          </div>
                          <span className="font-black text-sm md:text-base text-black">{entry.name}</span>
                        </div>

                        <div className="flex items-center gap-1 font-mono font-black text-sm text-black bg-white px-2.5 py-0.5 border border-black">
                          <span>{entry.score}</span>
                          <span className="text-xs text-gray-600">마리</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-3 text-right">
              <span className="text-[11px] text-gray-400 font-bold">* 30초 동안 잡은 물고기 수로 순위가 결정됩니다.</span>
            </div>
          </section>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {session ? (
            <>
              <button
                onClick={() => {
                  sounds.playTap();
                  onPlayAgain();
                }}
                className="flex-1 py-3 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-black text-base border-4 border-black shadow-[5px_5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                🎣 다시 낚시하기 ({session.studentName})
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onChangeStudent();
                }}
                className="flex-1 py-3 bg-[#FEF08A] hover:bg-[#FDE047] text-black font-black text-base border-4 border-black shadow-[5px_5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                👥 다른 친구 하기 (이름 선택)
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                sounds.playTap();
                onChangeStudent();
              }}
              className="w-full py-3 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-black text-base border-4 border-black shadow-[5px_5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              🎒 꼬마 낚시꾼 이름 선택하고 낚시하러 가기 👉
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
