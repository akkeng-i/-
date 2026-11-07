import React, { useState } from 'react';
import { sounds } from '../soundEngine';

interface TeacherPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherPasswordModal: React.FC<TeacherPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    sounds.playTap();
    setErrorMsg('');
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    sounds.playTap();
    setErrorMsg('');
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    sounds.playTap();
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (inputPin: string) => {
    if (inputPin === '2026') {
      sounds.playSelect();
      setPin('');
      setErrorMsg('');
      onSuccess();
    } else {
      sounds.playWrong();
      setIsShaking(true);
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPin(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        className={`w-full max-w-sm bg-[#FEF9C3] border-4 border-black shadow-[8px_8px_0px_#000] p-6 transition-transform ${
          isShaking ? 'translate-x-1 duration-75 animate-bounce' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <h2 className="text-lg font-black text-black">선생님 확인</h2>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              setPin('');
              setErrorMsg('');
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center bg-red-400 hover:bg-red-500 text-white font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            title="닫기"
          >
            ✕
          </button>
        </div>

        <p className="text-xs font-bold text-gray-700 text-center mb-3">
          교사 설정에 접근하려면 비밀번호(4자리)를 눌러주세요.
        </p>

        {/* PIN Display */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex justify-center items-center gap-3 mb-2">
            {[0, 1, 2, 3].map(i => {
              const hasDigit = pin.length > i;
              return (
                <div
                  key={i}
                  className={`w-11 h-12 border-3 border-black flex items-center justify-center text-2xl font-black shadow-[3px_3px_0px_#000] ${
                    hasDigit ? 'bg-yellow-300 text-black' : 'bg-white text-gray-300'
                  }`}
                >
                  {hasDigit ? '●' : '○'}
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <p className="text-xs font-black text-red-600 text-center mt-2 animate-pulse">
              ❌ {errorMsg}
            </p>
          )}
        </form>

        {/* Numeric Keypad for Touch / Mouse */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => handleDigit(d)}
              className="py-2.5 bg-white hover:bg-yellow-100 text-black font-black text-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="py-2.5 bg-gray-200 hover:bg-gray-300 text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="py-2.5 bg-white hover:bg-yellow-100 text-black font-black text-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="py-2.5 bg-amber-200 hover:bg-amber-300 text-black font-black text-sm border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            ← 지움
          </button>
        </div>

        <div className="text-center pt-1 border-t border-gray-300">
          <p className="text-[11px] text-gray-500 font-bold">
            선생님 안내: 초기 설정 비밀번호는 <span className="text-blue-700 underline font-mono font-black">2026</span> 입니다.
          </p>
        </div>
      </div>
    </div>
  );
};
