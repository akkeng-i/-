import React, { useState, useEffect } from 'react';
import { sounds } from '../soundEngine';
import { Student } from '../types';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
  classFishCount: number;
  onUpdateClassFishCount: (count: number) => void;
  onResetLeaderboard: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  students,
  onUpdateStudents,
  classFishCount,
  onUpdateClassFishCount,
  onResetLeaderboard
}) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [fishCountInput, setFishCountInput] = useState(classFishCount.toString());
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  useEffect(() => {
    setFishCountInput(classFishCount.toString());
  }, [classFishCount]);

  if (!isOpen) return null;

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newStudentName.trim();
    if (!trimmed) return;
    sounds.playTap();
    const newStudent: Student = {
      id: Date.now().toString(),
      name: trimmed
    };
    onUpdateStudents([...students, newStudent]);
    setNewStudentName('');
  };

  const handleDelete = (id: string) => {
    sounds.playTap();
    onUpdateStudents(students.filter(s => s.id !== id));
  };

  const handleResetDefaults = () => {
    sounds.playTap();
    const defaults: Student[] = [
      { id: '1', name: '김민준' },
      { id: '2', name: '이서연' },
      { id: '3', name: '박준혁' },
      { id: '4', name: '최아린' },
      { id: '5', name: '정예원' },
      { id: '6', name: '윤해경' },
      { id: '7', name: '강도윤' },
      { id: '8', name: '한지우' }
    ];
    onUpdateStudents(defaults);
  };

  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;
    sounds.playTap();
    const names = bulkInput
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const newEntries: Student[] = names.map((name, i) => ({
      id: (Date.now() + i).toString(),
      name
    }));

    onUpdateStudents([...students, ...newEntries]);
    setBulkInput('');
    setShowBulkInput(false);
  };

  const handleUpdateFishCount = () => {
    const val = parseInt(fishCountInput, 10);
    if (!isNaN(val) && val >= 0) {
      sounds.playTap();
      onUpdateClassFishCount(val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#FEF9C3] border-4 border-black shadow-[8px_8px_0px_#000] p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-xl font-black text-black">선생님 설정 (반 관리)</h2>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              setIsConfirmingReset(false);
              onClose();
            }}
            className="w-9 h-9 flex items-center justify-center bg-red-400 hover:bg-red-500 text-white font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            title="닫기"
          >
            ✕
          </button>
        </div>

        {/* Section 1: Student List Management */}
        <div className="mb-5 bg-white border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800 text-sm">
              🎒 우리 반 원아 명단 ({students.length}명)
            </h3>
            <button
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              {showBulkInput ? '개별 추가로 전환' : '여러 명 한 번에 넣기'}
            </button>
          </div>

          {!showBulkInput ? (
            <form onSubmit={handleAddSingle} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="새 원아 이름 입력 (예: 홍길동)"
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                className="flex-1 px-3 py-1.5 border-2 border-black text-sm bg-yellow-50 focus:outline-none focus:bg-white"
                maxLength={10}
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                + 추가
              </button>
            </form>
          ) : (
            <div className="mb-3 space-y-2">
              <textarea
                placeholder="쉼표(,)나 줄바꿈으로 원아 이름들을 적어주세요.&#10;예: 김민준, 이서연, 박준혁"
                value={bulkInput}
                onChange={e => setBulkInput(e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 border-2 border-black text-xs bg-yellow-50 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleBulkAdd}
                  className="px-3 py-1 bg-[#4ADE80] text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  명단 일괄 등록
                </button>
              </div>
            </div>
          )}

          {/* Student Chips */}
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 bg-gray-50 border border-gray-300">
            {students.length === 0 ? (
              <p className="text-xs text-gray-500 py-2 w-full text-center">등록된 원아가 없습니다.</p>
            ) : (
              students.map(s => (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5 bg-yellow-100 border-2 border-black px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_#000]"
                >
                  <span>{s.name}</span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-500 hover:text-red-700 ml-1 text-xs font-black cursor-pointer"
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] text-gray-600 hover:text-black underline cursor-pointer"
            >
              기본 원아 명단으로 초기화
            </button>
          </div>
        </div>

        {/* Section 2: Class Aquarium Fish Target */}
        <div className="mb-5 bg-white border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
          <h3 className="font-bold text-gray-800 text-sm mb-2">
            🐟 우리 반 협동 수족관 물고기 수 관리
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-600 block mb-1">
                현재 우리 반 누적 물고기 수 (목표: 200마리)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  value={fishCountInput}
                  onChange={e => setFishCountInput(e.target.value)}
                  className="w-24 px-2 py-1.5 border-2 border-black text-sm bg-yellow-50 font-bold"
                  min={0}
                  max={500}
                />
                <button
                  type="button"
                  onClick={handleUpdateFishCount}
                  className="px-3 py-1.5 bg-sky-300 hover:bg-sky-400 text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  수량 적용
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    onUpdateClassFishCount(0);
                    setFishCountInput('0');
                  }}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-black text-xs border-2 border-black font-bold shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  기본값(0) 리셋
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Leaderboard Management */}
        <div className="mb-4 bg-white border-2 border-black p-4 shadow-[3px_3px_0px_#000] space-y-2">
          <h3 className="font-bold text-gray-800 text-sm">
            🏆 명예의 전당 점수 관리
          </h3>

          {resetFeedback && (
            <div className="p-2 bg-emerald-100 border-2 border-emerald-500 text-emerald-800 font-bold text-xs text-center">
              {resetFeedback}
            </div>
          )}

          {isConfirmingReset ? (
            <div className="p-3 bg-red-50 border-2 border-red-500 text-center space-y-2">
              <p className="text-xs font-black text-red-700">
                ⚠️ 명예의 전당 점수 기록을 모두 초기화(0건)하시겠습니까?
              </p>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    onResetLeaderboard();
                    setIsConfirmingReset(false);
                    setResetFeedback('✅ 명예의 전당 점수가 깨끗하게 초기화되었습니다.');
                    setTimeout(() => setResetFeedback(null), 3000);
                  }}
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  예, 초기화합니다
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsConfirmingReset(false);
                  }}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsConfirmingReset(true);
              }}
              className="w-full py-2 bg-orange-200 hover:bg-orange-300 text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🔄</span>
              <span>명예의 전당 점수 초기화</span>
            </button>
          )}

          <p className="text-[11px] text-gray-500">
            * 초기화 시 기존에 기록된 1~5등 낚시왕 랭킹 기록이 모두 리셋됩니다.
          </p>
        </div>

        {/* Footer Close */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              sounds.playTap();
              setIsConfirmingReset(false);
              onClose();
            }}
            className="w-full py-2.5 bg-[#FEF08A] hover:bg-[#FDE047] text-black font-black text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            설정 완료하고 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
