import fs from 'node:fs';

const pikachuB64 = 'data:image/png;base64,' + fs.readFileSync('public/images/피카츄4.png').toString('base64');
const charmanderB64 = 'data:image/png;base64,' + fs.readFileSync('public/images/파이리3.png').toString('base64');
const squirtleB64 = 'data:image/png;base64,' + fs.readFileSync('public/images/꼬부기4.png').toString('base64');
const bulbasaurB64 = 'data:image/png;base64,' + fs.readFileSync('public/images/이상해씨3.png').toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>숲속 글자 낚시꾼</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- FontAwesome CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <!-- Cute Rounded Korean Font Jua & Retro Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css" />
  <style>
    @font-face {
      font-family: 'DungGeunMo';
      src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    body {
      font-family: 'Jua', 'DungGeunMo', sans-serif;
      user-select: none;
      -webkit-user-select: none;
    }
    /* Pixel Art & Avatar Clarity */
    img.pixel-art, .pixel-avatar {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      object-fit: contain;
    }
    /* Retro UI Box & Shadows */
    .retro-box {
      border: 4px solid #000000;
      box-shadow: 5px 5px 0px #000000;
    }
    .retro-btn {
      border: 3px solid #000000;
      box-shadow: 4px 4px 0px #000000;
      transition: transform 0.08s ease, box-shadow 0.08s ease;
      cursor: pointer;
    }
    .retro-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px #000000;
    }
    /* Boat Bobbing Animation */
    @keyframes boatSway {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-4px) rotate(1.2deg); }
    }
    .boat-bobbing {
      animation: boatSway 2.8s ease-in-out infinite;
    }
    /* Seaweed Sway */
    @keyframes weedSway {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
    }
    .seaweed-sway {
      animation: weedSway 3s ease-in-out infinite;
    }
    /* Bubble Float */
    @keyframes bubbleRise {
      0% { transform: translateY(100%) scale(0.8); opacity: 0; }
      20% { opacity: 0.6; }
      80% { opacity: 0.8; }
      100% { transform: translateY(-300px) scale(1.2); opacity: 0; }
    }
    .animate-bubble {
      animation: bubbleRise 5s linear infinite;
    }
    /* Confetti Drop */
    @keyframes confettiDrop {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    .animate-confetti {
      animation: confettiDrop 3s linear infinite;
    }
  </style>
</head>
<body class="bg-[#E0F2FE] text-slate-900 min-h-screen overflow-x-hidden flex flex-col justify-between">

  <!-- APP ROOT WRAPPER -->
  <div id="app" class="w-full flex-1 flex flex-col"></div>

  <script>
    const AVATAR_FALLBACKS = {
      'pikachu': '${pikachuB64}',
      'charmander': '${charmanderB64}',
      'squirtle': '${squirtleB64}',
      'bulbasaur': '${bulbasaurB64}'
    };

    const CHARACTERS = [
      { id: 'pikachu', name: '피카츄', badge: '⚡ 번개', tagline: '번개처럼 빠른 낚시왕!', primaryPath: 'images/피카츄4.png', color: '#FEF08A' },
      { id: 'charmander', name: '파이리', badge: '🔥 불꽃', tagline: '불꽃처럼 씩씩한 낚시왕!', primaryPath: 'images/파이리3.png', color: '#FED7AA' },
      { id: 'squirtle', name: '꼬부기', badge: '💧 물방울', tagline: '물속이 편안한 낚시왕!', primaryPath: 'images/꼬부기4.png', color: '#BAE6FD' },
      { id: 'bulbasaur', name: '이상해씨', badge: '🍃 풀잎', tagline: '숲속을 사랑하는 낚시왕!', primaryPath: 'images/이상해씨3.png', color: '#BBF7D0' }
    ];

    // Authentic, complete 2-letter Korean word pool
    const WORD_POOL = [
      { word: '사과', emoji: '🍎', target: '사', given: '과', missingIdx: 0, distractors: ['나', '가', '바', '마'] },
      { word: '포도', emoji: '🍇', target: '도', given: '포', missingIdx: 1, distractors: ['로', '고', '보', '소'] },
      { word: '딸기', emoji: '🍓', target: '딸', given: '기', missingIdx: 0, distractors: ['달', '말', '발', '알'] },
      { word: '수박', emoji: '🍉', target: '박', given: '수', missingIdx: 1, distractors: ['락', '각', '막', '낙'] },
      { word: '우유', emoji: '🥛', target: '유', given: '우', missingIdx: 1, distractors: ['구', '무', '누', '루'] },
      { word: '토끼', emoji: '🐰', target: '토', given: '끼', missingIdx: 0, distractors: ['도', '로', '고', '포'] },
      { word: '사자', emoji: '🦁', target: '자', given: '사', missingIdx: 1, distractors: ['차', '라', '마', '가'] },
      { word: '오리', emoji: '🦆', target: '오', given: '리', missingIdx: 0, distractors: ['아', '어', '우', '이'] },
      { word: '나비', emoji: '🦋', target: '비', given: '나', missingIdx: 1, distractors: ['기', '미', '시', '디'] },
      { word: '여우', emoji: '🦊', target: '여', given: '우', missingIdx: 0, distractors: ['야', '요', '유', '어'] },
      { word: '기차', emoji: '🚂', target: '차', given: '기', missingIdx: 1, distractors: ['가', '다', '사', '자'] },
      { word: '버스', emoji: '🚌', target: '스', given: '버', missingIdx: 1, distractors: ['트', '드', '르', '브'] },
      { word: '모자', emoji: '🧢', target: '모', given: '자', missingIdx: 0, distractors: ['포', '고', '보', '소'] },
      { word: '구두', emoji: '👞', target: '두', given: '구', missingIdx: 1, distractors: ['루', '수', '무', '주'] },
      { word: '나무', emoji: '🌳', target: '무', given: '나', missingIdx: 1, distractors: ['구', '두', '루', '수'] },
      { word: '바다', emoji: '🌊', target: '바', given: '다', missingIdx: 0, distractors: ['마', '사', '가', '나'] },
      { word: '고래', emoji: '🐳', target: '고', given: '래', missingIdx: 0, distractors: ['도', '로', '포', '조'] },
      { word: '치즈', emoji: '🧀', target: '즈', given: '치', missingIdx: 1, distractors: ['크', '트', '드', '브'] },
      { word: '감자', emoji: '🥔', target: '감', given: '자', missingIdx: 0, distractors: ['남', '담', '람', '삼'] },
      { word: '비누', emoji: '🧼', target: '비', given: '누', missingIdx: 0, distractors: ['기', '니', '디', '리'] },
      { word: '아기', emoji: '👶', target: '아', given: '기', missingIdx: 0, distractors: ['오', '우', '어', '이'] },
      { word: '의자', emoji: '🪑', target: '의', given: '자', missingIdx: 0, distractors: ['이', '으', '에', '오'] },
      { word: '시계', emoji: '⏰', target: '시', given: '계', missingIdx: 0, distractors: ['기', '니', '디', '리'] },
      { word: '하마', emoji: '🦛', target: '마', given: '하', missingIdx: 1, distractors: ['바', '사', '가', '다'] },
      { word: '오이', emoji: '🥒', target: '이', given: '오', missingIdx: 1, distractors: ['아', '어', '우', '으'] },
      { word: '가지', emoji: '🍆', target: '가', given: '지', missingIdx: 0, distractors: ['나', '다', '라', '마'] },
      { word: '양말', emoji: '🧦', target: '말', given: '양', missingIdx: 1, distractors: ['달', '발', '갈', '날'] },
      { word: '당근', emoji: '🥕', target: '당', given: '근', missingIdx: 0, distractors: ['상', '방', '강', '장'] },
      { word: '거북', emoji: '🐢', target: '거', given: '북', missingIdx: 0, distractors: ['더', '서', '저', '너'] },
      { word: '양파', emoji: '🧅', target: '파', given: '양', missingIdx: 1, distractors: ['마', '바', '사', '가'] },
      { word: '고추', emoji: '🌶️', target: '추', given: '고', missingIdx: 1, distractors: ['루', '수', '무', '주'] },
      { word: '치마', emoji: '👗', target: '치', given: '마', missingIdx: 0, distractors: ['기', '디', '리', '시'] },
      { word: '피리', emoji: '🪈', target: '피', given: '리', missingIdx: 0, distractors: ['지', '치', '키', '티'] },
      { word: '풍선', emoji: '🎈', target: '선', given: '풍', missingIdx: 1, distractors: ['천', '건', '번', '전'] },
      { word: '장화', emoji: '👢', target: '장', given: '화', missingIdx: 0, distractors: ['상', '방', '강', '당'] },
      { word: '침대', emoji: '🛏️', target: '침', given: '대', missingIdx: 0, distractors: ['김', '림', '심', '임'] },
      { word: '휴지', emoji: '🧻', target: '휴', given: '지', missingIdx: 0, distractors: ['유', '류', '슈', '주'] },
      { word: '참외', emoji: '🍈', target: '참', given: '외', missingIdx: 0, distractors: ['남', '담', '람', '삼'] }
    ];

    // Korean Name & Particle Helper
    function getGivenName(fullName) {
      const trimmed = (fullName || '').trim();
      if (!trimmed) return '친구';
      if (trimmed.length >= 3) return trimmed.slice(1);
      const commonSurnames = '김이박최정강조윤장임한오서신권황안송전홍고문손양배백허유남심노하곽성차주우구민진지엄채원천방공현함변염';
      if (trimmed.length === 2 && commonSurnames.includes(trimmed[0])) return trimmed.slice(1);
      return trimmed;
    }

    function hasBatchim(str) {
      if (!str) return false;
      const lastChar = str.charCodeAt(str.length - 1);
      if (lastChar < 0xac00 || lastChar > 0xd7a3) return false;
      return (lastChar - 0xac00) % 28 !== 0;
    }

    function formatPraise(fullName, word) {
      const given = getGivenName(fullName);
      const voc = hasBatchim(given) ? '아' : '야';
      return given + voc + ' 축하해! 🎉 ' + \"'\" + word + \"'\" + ' 완성!';
    }

    function formatResultSubject(fullName) {
      const given = getGivenName(fullName);
      const particle = hasBatchim(given) ? '이는' : '는';
      return given + particle + ' 오늘';
    }

    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmGain = null;
        this.bgmTimer = null;
        this.bgmStep = 0;
        this.isBgmPlaying = false;
      }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.setValueAtTime(this.muted ? 0 : 0.05, this.ctx.currentTime);
            this.bgmGain.connect(this.ctx.destination);
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }
      setMuted(m) {
        this.muted = m;
        if (this.ctx && this.bgmGain) {
          this.bgmGain.gain.setValueAtTime(m ? 0 : 0.05, this.ctx.currentTime);
        }
      }
      startBgm() {
        this.init();
        if (!this.ctx) return;
        this.isBgmPlaying = true;
        this.bgmStep = 0;
        if (this.bgmTimer) clearInterval(this.bgmTimer);

        const melody = [
          523.25, 0, 659.25, 0, 783.99, 880.00, 783.99, 0,
          659.25, 523.25, 587.33, 659.25, 523.25, 0, 0, 0,
          587.33, 0, 659.25, 0, 783.99, 0, 880.00, 0,
          1046.50, 880.00, 783.99, 659.25, 523.25, 0, 0, 0
        ];

        this.bgmTimer = setInterval(() => {
          if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
          const now = this.ctx.currentTime;
          const step = this.bgmStep % melody.length;
          const f = melody[step];
          if (f > 0) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(0.045, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.16);
            osc.connect(gain);
            gain.connect(this.bgmGain);
            osc.start(now);
            osc.stop(now + 0.17);
          }
          this.bgmStep++;
        }, 180);
      }
      pauseBgm() {
        this.isBgmPlaying = false;
      }
      resumeBgm() {
        if (!this.isBgmPlaying && this.bgmTimer) {
          this.isBgmPlaying = true;
        } else if (!this.bgmTimer) {
          this.startBgm();
        }
      }
      stopBgm() {
        this.isBgmPlaying = false;
        if (this.bgmTimer) {
          clearInterval(this.bgmTimer);
          this.bgmTimer = null;
        }
      }
      playTap() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
      playSelect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [ { f: 523.25, t: 0, d: 0.08 }, { f: 783.99, t: 0.07, d: 0.12 }, { f: 1046.50, t: 0.15, d: 0.2 } ].forEach(n => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(n.f, now + n.t);
          gain.gain.setValueAtTime(0.2, now + n.t);
          gain.gain.exponentialRampToValueAtTime(0.01, now + n.t + n.d);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + n.t);
          osc.stop(now + n.t + n.d);
        });
      }
      playCast() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
      }
      playCorrect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [ { f: 523.25, d: 0.09 }, { f: 659.25, d: 0.09 }, { f: 783.99, d: 0.09 }, { f: 1046.50, d: 0.22 }, { f: 1318.51, d: 0.3 } ].forEach((n, idx) => {
          const t = now + idx * 0.08;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(n.f, t);
          gain.gain.setValueAtTime(0.16, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + n.d);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + n.d);
        });
      }
      playWrong() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.3);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      }
      playSplash() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      }
      playTimeUp() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [ { f: 440, t: 0, d: 0.18 }, { f: 440, t: 0.2, d: 0.18 }, { f: 330, t: 0.4, d: 0.4 } ].forEach(tone => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(tone.f, now + tone.t);
          gain.gain.setValueAtTime(0.15, now + tone.t);
          gain.gain.exponentialRampToValueAtTime(0.01, now + tone.t + tone.d);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + tone.t);
          osc.stop(now + tone.t + tone.d);
        });
      }
      playTrophy() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const melody = [523.25, 523.25, 523.25, 659.25, 587.33, 659.25, 783.99, 1046.50];
        melody.forEach((f, i) => {
          const t = now + i * 0.12;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.28);
        });
      }
      speak(word) {
        if (!window.speechSynthesis) return;
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(word);
          u.lang = 'ko-KR';
          u.rate = 0.85;
          u.pitch = 1.2;
          window.speechSynthesis.speak(u);
        } catch(e) {}
      }
    }
    const snd = new SoundEngine();

    const STATE = {
      view: 'SELECT_STUDENT',
      selectedStudent: null,
      selectedAvatar: null,
      students: JSON.parse(localStorage.getItem('STUDENT_LIST') || 'null') || [
        '김민준', '이서연', '박준혁', '최아린', '정예원', '윤해경', '강도윤', '한지우'
      ],
      classFishCount: parseInt(localStorage.getItem('CLASS_FISH_COUNT') || '0', 10),
      hallOfFame: JSON.parse(localStorage.getItem('FISHING_HALL_OF_FAME') || '[]'),
      currentScore: 0,
      timeLeft: 30, // 30 seconds
      currentWord: null,
      shuffledWords: [],
      wordIdx: 0,
      fishes: [],
      hookedFishId: null,
      hookTarget: null,
      isReelingUp: false,
      isPaused: false,
      gameTimerId: null,
      animFrameId: null,
      teacherModalOpen: false,
      timeUpModalOpen: false
    };

    function saveState() {
      localStorage.setItem('STUDENT_LIST', JSON.stringify(STATE.students));
      localStorage.setItem('CLASS_FISH_COUNT', STATE.classFishCount.toString());
      localStorage.setItem('FISHING_HALL_OF_FAME', JSON.stringify(STATE.hallOfFame));
    }

    function render() {
      const app = document.getElementById('app');
      if (STATE.view === 'SELECT_STUDENT') {
        renderStudentSelect(app);
      } else if (STATE.view === 'SELECT_AVATAR') {
        renderAvatarSelect(app);
      } else if (STATE.view === 'PLAYING') {
        renderPlaying(app);
      } else if (STATE.view === 'RESULT') {
        renderResult(app);
      }
      renderTeacherModal();
    }

    // 1. Student Selection View: No subtext, clean header
    function renderStudentSelect(root) {
      snd.stopBgm();
      const studentCards = STATE.students.map(name => \`
        <button onclick="selectStudent('\${name}')" class="retro-btn py-4 px-2 bg-[#FEF08A] hover:bg-[#FDE047] active:bg-yellow-400 flex flex-col items-center justify-center gap-1 text-center group">
          <span class="text-xs text-gray-700 font-bold group-hover:scale-110 transition-transform">🐟</span>
          <span class="text-xl md:text-2xl font-black text-black tracking-wide">\${name}</span>
          <span class="text-[10px] text-blue-700 font-extrabold group-hover:underline">낚시 시작! 👉</span>
        </button>
      \`).join('');

      root.innerHTML = \`
        <div class="flex-1 flex flex-col items-center justify-between p-4 md:p-6 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#BBF7D0]">
          <div class="w-full max-w-4xl flex items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-2">
              <span class="text-3xl">🌲</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="openHallOfFame()" class="retro-btn px-4 py-2 bg-[#FEF08A] hover:bg-[#FDE047] text-black font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer">
                <span>🏆</span>
                <span>명예의 전당</span>
              </button>
              <button onclick="openTeacherModal()" class="retro-btn px-4 py-2 bg-white hover:bg-gray-100 text-black font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer">
                <span>⚙️</span>
                <span>교사 설정</span>
              </button>
            </div>
          </div>

          <div class="w-full max-w-2xl text-center mb-6">
            <div class="inline-block bg-[#FEF9C3] retro-box px-6 py-3 mb-3">
              <h1 class="text-2xl md:text-4xl font-black text-black tracking-tight">
                🎣 숲속 글자 낚시꾼 🐟
              </h1>
            </div>
            <p class="text-sm md:text-base font-bold text-gray-800 bg-white/90 inline-block px-4 py-1 retro-box">
              내 이름을 입력하고 함께할 포켓몬을 골라보세요!
            </p>
          </div>

          <div class="w-full max-w-4xl bg-[#15803D] border-8 border-[#78350F] shadow-[10px_10px_0px_#000] p-6 md:p-8 mb-6">
            <div class="flex items-center justify-between border-b-2 border-white/40 pb-2 mb-4">
              <span class="text-white font-black text-sm md:text-base tracking-wide">🎒 우리 반 낚시 친구들 (총 \${STATE.students.length}명)</span>
              <span class="text-yellow-300 text-xs font-bold">👇 이름을 콕 터치하세요!</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-h-[380px] overflow-y-auto p-1">
              \${studentCards}
            </div>
          </div>

          <div class="w-full max-w-4xl bg-white retro-box p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">🌊</span>
              <span class="text-xs md:text-sm font-black">오늘 우리 반이 잡은 물고기:</span>
              <span class="text-sm md:text-base font-black text-blue-600 font-mono">\${STATE.classFishCount} / 200 마리</span>
            </div>
            <div class="w-full sm:w-48 h-4 bg-gray-200 border border-black overflow-hidden">
              <div class="h-full bg-blue-500" style="width: \${Math.min(100, (STATE.classFishCount / 200) * 100)}%"></div>
            </div>
          </div>
        </div>
      \`;
    }

    window.selectStudent = function(name) {
      snd.playTap();
      STATE.selectedStudent = name;
      STATE.view = 'SELECT_AVATAR';
      render();
    };

    function renderAvatarSelect(root) {
      const avatarCards = CHARACTERS.map(c => \`
        <button onclick="selectAvatar('\${c.id}')" style="background-color: \${c.color};" class="retro-btn p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 group">
          <span class="text-xs font-black px-2 py-0.5 bg-white/90 border-2 border-black">\${c.badge}</span>
          <div class="w-16 h-16 flex items-center justify-center bg-white/70 border-2 border-black p-1 shadow-[2px_2px_0px_#000]">
            <img src="\${c.primaryPath}" alt="\${c.name}" class="pixel-avatar w-12 h-12" onerror="this.src=AVATAR_FALLBACKS['\${c.id}']" />
          </div>
          <span class="text-lg font-black text-black">\${c.name}</span>
          <span class="text-[11px] font-bold text-gray-700">\${c.tagline}</span>
          <span class="text-xs text-blue-700 font-black group-hover:underline">👉 터치해서 선택!</span>
        </button>
      \`).join('');

      root.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div class="w-full max-w-lg bg-[#E0F2FE] retro-box p-6 text-center animate-in">
            <div class="inline-block bg-[#FEF08A] retro-box px-4 py-1.5 mb-3">
              <span class="text-xl md:text-2xl font-black text-black">🎣 낚시 파트너를 골라봐!</span>
            </div>
            <p class="text-base md:text-lg font-bold text-gray-800 mb-6">
              안녕, <span class="text-blue-600 font-black underline decoration-4 decoration-yellow-400">\${STATE.selectedStudent}</span>아!
              함께 호수로 떠날 친구를 터치해줘!
            </p>
            <div class="grid grid-cols-2 gap-4 mb-6">
              \${avatarCards}
            </div>
            <button onclick="cancelAvatarSelect()" class="retro-btn px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold text-sm">
              뒤로 가기 (이름 다시 고르기)
            </button>
          </div>
        </div>
      \`;
    }

    window.cancelAvatarSelect = function() {
      snd.playTap();
      STATE.view = 'SELECT_STUDENT';
      render();
    };

    window.selectAvatar = function(avatarId) {
      snd.playSelect();
      const char = CHARACTERS.find(c => c.id === avatarId) || CHARACTERS[0];
      STATE.selectedAvatar = char;
      startGame();
    };

    function startGame() {
      STATE.view = 'PLAYING';
      STATE.currentScore = 0;
      STATE.timeLeft = 30; // 30 seconds
      STATE.isPaused = false;
      STATE.hookedFishId = null;
      STATE.isReelingUp = false;
      STATE.hookTarget = null;
      STATE.timeUpModalOpen = false;
      STATE.shuffledWords = [...WORD_POOL].sort(() => Math.random() - 0.5);
      STATE.wordIdx = 0;
      STATE.currentWord = STATE.shuffledWords[0];

      spawnFishesForCurrentWord();
      snd.startBgm();

      if (STATE.gameTimerId) clearInterval(STATE.gameTimerId);
      STATE.gameTimerId = setInterval(() => {
        if (!STATE.isPaused && !STATE.timeUpModalOpen) {
          STATE.timeLeft--;
          updateHUD();
          if (STATE.timeLeft <= 0) {
            clearInterval(STATE.gameTimerId);
            snd.stopBgm();
            snd.playTimeUp();
            STATE.timeUpModalOpen = true;
            renderPlaying(document.getElementById('app'));
          }
        }
      }, 1000);

      render();
      snd.speak(STATE.currentWord.word);
    }

    function spawnFishesForCurrentWord() {
      const w = STATE.currentWord;
      const chars = [w.target, ...w.distractors.slice(0, 4)].sort(() => Math.random() - 0.5);
      const colors = ['#F97316', '#38BDF8', '#FACC15', '#A855F7', '#EC4899', '#34D399'];

      STATE.fishes = chars.map((ch, i) => ({
        id: 'fish-' + i + '-' + Date.now(),
        char: ch,
        isTarget: ch === w.target,
        x: 10 + i * 16,
        y: 20 + i * 14 + (Math.random() * 6 - 3),
        speed: 0.08 + Math.random() * 0.07,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: colors[i % colors.length],
        caught: false,
        wobble: false
      }));
    }

    function renderPlaying(root) {
      const char = STATE.selectedAvatar;
      const w = STATE.currentWord;

      root.innerHTML = \`
        <div class="relative w-full h-screen max-h-screen overflow-hidden flex flex-col bg-slate-900 select-none">
          <header class="relative z-30 flex items-center justify-between px-3 py-2 bg-[#FEF08A] border-b-4 border-black shadow-[0_4px_0_#000]">
            <div class="flex items-center gap-2 bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
              <div class="w-8 h-8 flex items-center justify-center bg-sky-100 border border-black p-0.5">
                <img src="\${char.primaryPath}" alt="\${char.name}" class="pixel-avatar w-7 h-7" onerror="this.src=AVATAR_FALLBACKS['\${char.id}']" />
              </div>
              <div class="flex flex-col leading-none">
                <span class="text-[10px] text-gray-600 font-bold">\${char.name} 낚시꾼</span>
                <span class="text-sm font-black text-black">\${STATE.selectedStudent}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
              <span class="text-xs font-black text-gray-700">⏰ 남은 시간</span>
              <div class="w-24 md:w-32 h-4 bg-gray-200 border border-black overflow-hidden relative">
                <div id="timer-bar" class="h-full bg-emerald-400 transition-all duration-300" style="width: \${(STATE.timeLeft / 30) * 100}%"></div>
              </div>
              <span id="timer-text" class="font-mono font-black text-sm tabular-nums text-black">\${STATE.timeLeft}초</span>
            </div>

            <div class="flex items-center gap-1.5 bg-[#BBF7D0] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
              <span class="text-base">🐟</span>
              <span class="text-xs font-bold text-gray-800">잡은 물고기</span>
              <span id="hud-score" class="text-base font-black text-black font-mono tabular-nums">\${STATE.currentScore}마리</span>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="toggleSound()" id="sound-btn" class="w-8 h-8 flex items-center justify-center bg-white border-2 border-black text-sm">\${snd.muted ? '🔇' : '🔊'}</button>
              <button onclick="togglePause()" class="px-2 py-1 bg-amber-300 font-black text-xs border-2 border-black">일시정지</button>
              <button onclick="exitPlaying()" class="px-2 py-1 bg-rose-400 font-black text-xs text-white border-2 border-black">나가기</button>
            </div>
          </header>

          <div class="relative w-full h-[40%] bg-gradient-to-b from-[#60A5FA] via-[#93C5FD] to-[#38BDF8] overflow-hidden border-b-4 border-black">
            <div class="absolute top-3 left-8 w-20 h-7 bg-white/90 shadow-[2px_2px_0px_#000]"></div>
            <div class="absolute top-6 right-16 w-24 h-8 bg-white/90 shadow-[2px_2px_0px_#000]"></div>

            <div class="absolute bottom-6 left-0 right-0 h-16 flex items-end justify-between px-2 pointer-events-none opacity-90">
              <div class="w-10 h-10 bg-[#15803D] border-2 border-black rotate-45 mb-[-8px]"></div>
              <div class="w-12 h-12 bg-[#166534] border-2 border-black rotate-45 mb-[-8px]"></div>
              <div class="w-10 h-10 bg-[#15803D] border-2 border-black rotate-45 mb-[-8px]"></div>
              <div class="w-12 h-12 bg-[#166534] border-2 border-black rotate-45 mb-[-8px]"></div>
            </div>

            <div class="absolute bottom-0 left-0 right-0 h-6 bg-[#0284C7] border-t-2 border-white/60"></div>

            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 boat-bobbing">
              <div class="relative flex items-end">
                <img src="\${char.primaryPath}" alt="\${char.name}" class="pixel-avatar w-14 h-14 sm:w-16 sm:h-16 object-contain -mr-2 mb-1 z-10" onerror="this.src=AVATAR_FALLBACKS['\${char.id}']" />
                <div class="relative w-14 h-16 origin-bottom-left rotate-[-25deg] mb-2 pointer-events-none">
                  <div class="absolute bottom-0 left-0 w-1.5 h-16 bg-[#B45309] border border-black"></div>
                  <div class="absolute top-0 right-0 w-2 h-2 bg-yellow-400 border border-black"></div>
                </div>
              </div>
              <div class="relative w-36 sm:w-44 h-8 bg-[#92400E] border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center">
                <span class="text-[10px] font-black text-yellow-200 bg-black/60 px-2 py-0.5 border border-yellow-400/80">\${STATE.selectedStudent}호</span>
              </div>
            </div>

            <svg id="fishing-line-svg" class="absolute inset-0 w-full h-full pointer-events-none z-15">
              <line id="fishing-line-sky" x1="54%" y1="55%" x2="\${STATE.hookTarget ? STATE.hookTarget.x + '%' : '54%'}" y2="100%" stroke="#1E293B" stroke-width="2.5" stroke-dasharray="4 2" />
            </svg>

            <!-- Word Clue: Solid, steady, no flickering -->
            <div class="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              <div class="bg-[#FFFBEB] retro-box px-4 py-2 flex items-center gap-3">
                <span class="text-3xl md:text-4xl">\${w.emoji}</span>
                <div class="flex items-center gap-2">
                  <div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-3 border-black text-2xl md:text-3xl font-black \${w.missingIdx === 0 ? 'bg-[#FEF08A] text-amber-900 border-black' : 'bg-white text-black'}">
                    \${w.missingIdx === 0 ? '?' : w.given}
                  </div>
                  <div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-3 border-black text-2xl md:text-3xl font-black \${w.missingIdx === 1 ? 'bg-[#FEF08A] text-amber-900 border-black' : 'bg-white text-black'}">
                    \${w.missingIdx === 1 ? '?' : w.given}
                  </div>
                </div>
                <button onclick="repeatVoice()" class="w-10 h-10 flex items-center justify-center bg-yellow-300 hover:bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000] text-lg active:translate-x-[1px] active:translate-y-[1px]">
                  📢
                </button>
              </div>
              <div class="mt-1 bg-black text-yellow-300 px-3 py-0.5 text-xs font-bold shadow-[2px_2px_0px_#000]">
                물속에서 <span class="text-white font-black underline">'\${w.target}'</span> 물고기를 낚아줘! 🎣
              </div>
            </div>
          </div>

          <div id="lake-view" class="relative w-full h-[60%] bg-gradient-to-b from-[#0369A1] via-[#075985] to-[#082F49] overflow-hidden">
            <div class="absolute bottom-0 left-0 right-0 h-12 bg-[#B45309] border-t-4 border-[#78350F] flex items-end justify-between px-3 pointer-events-none">
              <div class="seaweed-sway w-3 h-8 bg-emerald-600 border border-black"></div>
              <div class="seaweed-sway w-3 h-10 bg-emerald-600 border border-black"></div>
              <div class="seaweed-sway w-3 h-7 bg-emerald-600 border border-black"></div>
              <div class="seaweed-sway w-3 h-11 bg-emerald-600 border border-black"></div>
            </div>

            <svg id="hook-line-lake" class="absolute inset-0 w-full h-full pointer-events-none z-15"></svg>
            <div id="fish-layer" class="absolute inset-0"></div>

            <!-- Praise Modal with given name (Appears ONLY AFTER fish is lifted into the boat) -->
            <div id="praise-overlay" class="hidden absolute inset-0 z-40 flex items-center justify-center bg-black/40">
              <div class="bg-[#FEF08A] retro-box p-6 text-center max-w-sm mx-4">
                <div class="text-4xl mb-2 animate-bounce">🎣 ✨</div>
                <h3 id="praise-text" class="text-xl md:text-2xl font-black text-black mb-1"></h3>
                <p class="text-xs font-bold text-gray-700">+1점 획득! 다음 단어로 출발! 🚀</p>
              </div>
            </div>

            <!-- Time's Up Modal with given name and "낚시 끝내기" button -->
            \${STATE.timeUpModalOpen ? \`
              <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs">
                <div class="w-full max-w-md bg-[#FFFBEB] retro-box p-6 md:p-8 text-center mx-4">
                  <div class="text-5xl mb-3 animate-bounce">⏰ 🎣</div>
                  <h2 class="text-2xl md:text-3xl font-black text-black mb-2">낚시 시간이 끝났어요!</h2>
                  <p class="text-sm md:text-base font-bold text-gray-800 mb-6 bg-[#FEF08A] border-2 border-black py-2.5 px-3">
                    <span class="text-blue-600 font-black">\${formatResultSubject(STATE.selectedStudent)}</span>
                    <span class="text-red-600 font-black font-mono text-lg"> \${STATE.currentScore}마리</span>의 글자 물고기를 낚았어요!
                  </p>
                  <button onclick="confirmFinishFishing()" class="w-full py-3.5 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-black text-lg retro-btn flex items-center justify-center gap-2">
                    <span>🎣</span>
                    <span>낚시 끝내기 (결과 보러 가기) 👉</span>
                  </button>
                </div>
              </div>
            \` : ''}
          </div>
        </div>
      \`;

      startFishLoop();
    }

    function updateHUD() {
      const bar = document.getElementById('timer-bar');
      const txt = document.getElementById('timer-text');
      if (bar && txt) {
        bar.style.width = ((STATE.timeLeft / 30) * 100) + '%';
        txt.innerText = STATE.timeLeft + '초';
        if (STATE.timeLeft <= 5) {
          bar.className = 'h-full bg-red-500 animate-pulse transition-all duration-300';
          txt.className = 'font-mono font-black text-sm tabular-nums text-red-600 animate-bounce';
        }
      }
    }

    function startFishLoop() {
      if (STATE.animFrameId) cancelAnimationFrame(STATE.animFrameId);
      let lastTime = performance.now();

      function loop(now) {
        const dt = (now - lastTime) / 16.66;
        lastTime = now;

        if (!STATE.isPaused && !STATE.timeUpModalOpen && STATE.view === 'PLAYING') {
          STATE.fishes.forEach(f => {
            if (!f.caught) {
              f.x += f.direction * f.speed * dt;
              if (f.x > 88) { f.x = 88; f.direction = -1; }
              else if (f.x < 8) { f.x = 8; f.direction = 1; }
            }
          });
          drawFishes();
        }

        if (STATE.view === 'PLAYING') {
          STATE.animFrameId = requestAnimationFrame(loop);
        }
      }

      STATE.animFrameId = requestAnimationFrame(loop);
    }

    function drawFishes() {
      const layer = document.getElementById('fish-layer');
      if (!layer) return;

      layer.innerHTML = STATE.fishes.map(f => {
        const isHooked = f.id === STATE.hookedFishId;
        const targetX = STATE.isReelingUp && isHooked ? 54 : f.x;
        const targetY = STATE.isReelingUp && isHooked ? 2 : f.y;

        return \`
          <button onclick="handleFishClick('\${f.id}')" \${STATE.hookedFishId ? 'disabled' : ''} style="left: \${targetX}%; top: \${targetY}%; transform: translate(-50%, -50%) scaleX(\${f.direction}) \${f.wobble ? 'rotate(15deg) scale(1.2)' : ''} \${isHooked ? 'scale(1.25)' : ''}; transition: \${STATE.isReelingUp && isHooked ? 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'};" class="absolute z-20 focus:outline-none cursor-pointer">
            <div class="relative flex items-center justify-center p-1">
              <svg width="72" height="44" viewBox="0 0 72 44" class="drop-shadow-[3px_3px_0px_#000]">
                <ellipse cx="38" cy="22" rx="26" ry="17" fill="\${f.color}" stroke="#000" stroke-width="3" />
                <polygon points="6,7 18,22 6,37" fill="\${f.color}" stroke="#000" stroke-width="3" />
                <path d="M 28 6 Q 38 0 46 6 Z" fill="#FEF08A" stroke="#000" stroke-width="2" />
                <circle cx="53" cy="18" r="4" fill="#FFFFFF" stroke="#000" stroke-width="2" />
                <circle cx="54" cy="18" r="2" fill="#000000" />
                <ellipse cx="48" cy="26" rx="3.5" ry="2" fill="#F43F5E" opacity="0.8" />
                <path d="M 59 22 Q 62 25 58 27" fill="none" stroke="#000" stroke-width="2" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center" style="transform: scaleX(\${f.direction});">
                <span class="w-9 h-9 flex items-center justify-center bg-white border-2 border-black font-black text-xl text-black shadow-[2px_2px_0px_#000]">\${f.char}</span>
              </div>
            </div>
          </button>
        \`;
      }).join('');
    }

    window.handleFishClick = function(id) {
      if (STATE.hookedFishId || STATE.isPaused || STATE.timeUpModalOpen) return;
      const fish = STATE.fishes.find(f => f.id === id);
      if (!fish) return;

      if (fish.isTarget) {
        snd.playCast();
        STATE.hookedFishId = fish.id;
        STATE.hookTarget = { x: fish.x, y: fish.y };

        const lakeSvg = document.getElementById('hook-line-lake');
        if (lakeSvg) {
          lakeSvg.innerHTML = \`<line x1="54%" y1="0%" x2="\${fish.x}%" y2="\${fish.y}%" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="3 3"/><circle cx="\${fish.x}%" cy="\${fish.y}%" r="5" fill="#EF4444" stroke="#000" stroke-width="2"/>\`;
        }

        // Lift letter fish out of water to boat
        setTimeout(() => {
          snd.playSplash();
          STATE.isReelingUp = true;
          STATE.hookTarget = { x: 54, y: 5 };
          drawFishes();
          if (lakeSvg) {
            lakeSvg.innerHTML = \`<line x1="54%" y1="0%" x2="54%" y2="5%" stroke="#FFFFFF" stroke-width="2.5"/><circle cx="54%" cy="5%" r="5" fill="#EF4444" stroke="#000" stroke-width="2"/>\`;
          }
        }, 220);

        // Praise modal appears ONLY AFTER fish is lifted into the boat, with given name!
        setTimeout(() => {
          snd.playCorrect();
          if (STATE.currentWord) {
            snd.speak(STATE.currentWord.word);
          }
          STATE.currentScore++;
          const scoreElem = document.getElementById('hud-score');
          if (scoreElem) scoreElem.innerText = STATE.currentScore + '마리';

          const praiseOverlay = document.getElementById('praise-overlay');
          const praiseText = document.getElementById('praise-text');
          if (praiseOverlay && praiseText) {
            praiseText.innerText = formatPraise(STATE.selectedStudent, STATE.currentWord.word);
            praiseOverlay.classList.remove('hidden');
          }
        }, 850);

        setTimeout(() => {
          const praiseOverlay = document.getElementById('praise-overlay');
          if (praiseOverlay) praiseOverlay.classList.add('hidden');
          if (lakeSvg) lakeSvg.innerHTML = '';
          STATE.hookedFishId = null;
          STATE.isReelingUp = false;
          STATE.hookTarget = null;
          STATE.wordIdx = (STATE.wordIdx + 1) % STATE.shuffledWords.length;
          STATE.currentWord = STATE.shuffledWords[STATE.wordIdx];
          spawnFishesForCurrentWord();
          renderPlaying(document.getElementById('app'));
          snd.speak(STATE.currentWord.word);
        }, 2100);
      } else {
        snd.playWrong();
        snd.speak(fish.char + ', 다시 찾아보자');
        fish.wobble = true;
        fish.direction = fish.direction * -1;
        drawFishes();
        setTimeout(() => {
          fish.wobble = false;
          drawFishes();
        }, 500);
      }
    };

    window.repeatVoice = function() {
      snd.playTap();
      if (STATE.currentWord) {
        snd.speak(STATE.currentWord.word);
      }
    };

    window.toggleSound = function() {
      snd.setMuted(!snd.muted);
      const b = document.getElementById('sound-btn');
      if (b) b.innerText = snd.muted ? '🔇' : '🔊';
      if (!snd.muted) snd.playTap();
    };

    window.togglePause = function() {
      snd.playTap();
      STATE.isPaused = !STATE.isPaused;
      if (STATE.isPaused) {
        snd.pauseBgm();
      } else {
        snd.resumeBgm();
      }
    };

    // Immediate exit to first screen
    window.exitPlaying = function() {
      snd.playTap();
      clearInterval(STATE.gameTimerId);
      snd.stopBgm();
      STATE.view = 'SELECT_STUDENT';
      render();
    };

    window.confirmFinishFishing = function() {
      snd.playTap();
      finishGame();
    };

    function finishGame() {
      clearInterval(STATE.gameTimerId);
      snd.stopBgm();
      STATE.view = 'RESULT';
      STATE.classFishCount += STATE.currentScore;

      STATE.hallOfFame.push({
        name: STATE.selectedStudent,
        score: STATE.currentScore,
        avatarId: STATE.selectedAvatar.id,
        date: new Date().toISOString().split('T')[0]
      });
      STATE.hallOfFame.sort((a, b) => b.score - a.score);

      saveState();
      render();
    }

    // 2-Column Horizontal Split Result View
    // 2-Column Horizontal Split Result View
    function renderResult(root) {
      snd.stopBgm();
      const char = STATE.selectedAvatar || CHARACTERS[0];
      const isGoalReached = STATE.classFishCount >= 200;
      const pct = Math.min(100, Math.round((STATE.classFishCount / 200) * 100));

      if (isGoalReached) {
        snd.playTrophy();
      } else if (STATE.selectedStudent) {
        snd.playCorrect();
      }

      let topRankers = '';
      if (STATE.hallOfFame.length === 0) {
        topRankers = \`
          <div class="py-8 px-4 text-center border-2 border-dashed border-gray-300 bg-gray-50 space-y-2">
            <span class="text-3xl block">⭐</span>
            <p class="text-sm font-black text-gray-700">아직 등록된 낚시왕 기록이 없습니다.</p>
            <p class="text-xs font-bold text-gray-500">지금 낚시를 시작해 첫 번째 1등 왕관의 주인공이 되어보세요! 🎣</p>
          </div>
        \`;
      } else {
        topRankers = STATE.hallOfFame.slice(0, 5).map((entry, idx) => {
          const medal = idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐';
          const bg = idx === 0 ? 'bg-yellow-100' : idx === 1 ? 'bg-slate-100' : idx === 2 ? 'bg-amber-100' : 'bg-gray-50';
          const c = CHARACTERS.find(ch => ch.id === entry.avatarId) || CHARACTERS[0];
          return \`
            <div class="flex items-center justify-between p-2.5 border-2 border-black \${bg} shadow-[2px_2px_0px_#000]">
              <div class="flex items-center gap-2.5">
                <span class="text-xl w-6 text-center">\${medal}</span>
                <span class="text-xs font-mono font-bold text-gray-600">\${idx + 1}등</span>
                <img src="\${c.primaryPath}" class="pixel-avatar w-6 h-6 border border-black bg-white" onerror="this.src=AVATAR_FALLBACKS['\${c.id}']" />
                <span class="font-black text-sm md:text-base text-black">\${entry.name}</span>
              </div>
              <div class="font-mono font-black text-sm text-black bg-white px-2.5 py-0.5 border border-black">\${entry.score}마리</div>
            </div>
          \`;
        }).join('');
      }

      root.innerHTML = \`
        <div class="min-h-screen bg-[#E0F2FE] p-4 md:p-6 flex flex-col items-center justify-center">
          \${isGoalReached ? \`
            <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              <div class="animate-confetti w-3 h-3 bg-red-500 absolute left-[10%] top-0"></div>
              <div class="animate-confetti w-3 h-3 bg-blue-500 absolute left-[30%] top-0"></div>
              <div class="animate-confetti w-3 h-3 bg-yellow-500 absolute left-[50%] top-0"></div>
              <div class="animate-confetti w-3 h-3 bg-green-500 absolute left-[70%] top-0"></div>
              <div class="animate-confetti w-3 h-3 bg-purple-500 absolute left-[90%] top-0"></div>
            </div>
          \` : ''}

          <div class="w-full max-w-5xl space-y-4 my-auto">
            <div class="flex items-center justify-between gap-4 mb-1">
              <button onclick="changeStudent()" class="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-black font-black text-xs md:text-sm border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center gap-1.5">
                <span>←</span>
                <span>첫 화면으로</span>
              </button>

              <div class="inline-block bg-[#FEF08A] retro-box px-6 py-2">
                <h1 class="text-xl md:text-2xl font-black text-black">🏆 명예의 전당 & 우리 반 협동 수족관 🐟</h1>
              </div>

              <div class="w-20 hidden sm:block"></div>
            </div>

            <!-- Horizontal 2-Column Split: Left (Aquarium + Current Catcher) / Right (Leaderboard) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <!-- Left Column -->
              <div class="flex flex-col gap-4">
                <section class="bg-white retro-box p-4 md:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-base md:text-lg font-black text-black">🌊 우리 반이 잡은 물고기 수족관</span>
                      <span class="text-sm font-black bg-sky-100 border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000]">
                        🐟 <span class="font-mono text-blue-700 tabular-nums">\${STATE.classFishCount}</span> / 200 마리
                      </span>
                    </div>
                    <div class="relative w-full h-8 bg-sky-50 border-3 border-black overflow-hidden my-2">
                      <div class="h-full \${isGoalReached ? 'bg-amber-400' : 'bg-blue-500'}" style="width: \${pct}%"></div>
                      <div class="absolute top-1/2 -translate-y-1/2 text-lg pointer-events-none" style="left: \${Math.max(4, Math.min(94, pct))}%\">🐟</div>
                    </div>
                  </div>
                  \${isGoalReached ? \`
                    <div class="mt-2 bg-[#FEF08A] border-2 border-black p-2.5 text-center animate-bounce font-black text-red-600">
                      🎉 200마리 목표 달성! 우리 반 협동 수족관 대성공! 🏆
                    </div>
                  \` : \`
                    <p class="mt-2 text-right text-xs font-bold text-gray-500">
                      목표 200마리까지 앞으로 <span class="text-blue-600 font-black">\${Math.max(0, 200 - STATE.classFishCount)}마리</span> 남았어요!
                    </p>
                  \`}
                </section>

                \${STATE.selectedStudent ? \`
                  <section class="bg-[#FEF9C3] retro-box p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between gap-3 mb-2">
                      <div class="flex items-center gap-3">
                        <div class="w-14 h-14 flex items-center justify-center bg-white border-3 border-black p-1">
                          <img src="\${char.primaryPath}" alt="\${char.name}" class="pixel-avatar w-11 h-11" onerror="this.src=AVATAR_FALLBACKS['\${char.id}']" />
                        </div>
                        <div>
                          <span class="text-[11px] font-bold text-gray-600">오늘의 멋진 낚시꾼</span>
                          <h3 class="text-lg md:text-xl font-black text-black">\${STATE.selectedStudent} (\${char.name})</h3>
                        </div>
                      </div>
                      <div class="bg-white border-3 border-black px-4 py-1.5 shadow-[3px_3px_0px_#000]">
                        <span class="text-xl md:text-2xl font-black text-blue-600 font-mono">\${STATE.currentScore}마리! 🎣</span>
                      </div>
                    </div>
                    <div class="bg-white/80 border-2 border-black p-2 text-center text-xs md:text-sm font-bold text-gray-800">
                      <span class="text-blue-600 font-black">\${formatResultSubject(STATE.selectedStudent)}</span> 글자 물고기 <span class="text-red-600 font-black font-mono">\${STATE.currentScore}마리</span>를 멋지게 낚았어요!
                    </div>
                  </section>
                \` : \`
                  <section class="bg-[#FEF9C3] retro-box p-4 text-center space-y-2">
                    <div class="text-2xl">🎒</div>
                    <h3 class="text-base font-black text-black">나도 숲속 낚시왕에 도전해볼까요?</h3>
                    <p class="text-xs font-bold text-gray-700">내 이름을 선택하고 좋아하는 포켓몬과 함께 글자 물고기를 낚아보세요!</p>
                  </section>
                \`}
              </div>

              <!-- Right Column: Leaderboard -->
              <section class="bg-white retro-box p-4 md:p-5 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                    <span class="text-base md:text-lg font-black text-black">👑 숲속 낚시왕 명예의 전당</span>
                    <span class="text-xs text-gray-500 font-bold">우리 반 최고 기록 TOP 5</span>
                  </div>
                  <div class="space-y-2">
                    \${topRankers}
                  </div>
                </div>
                <div class="mt-3 text-right">
                  <span class="text-[11px] text-gray-400 font-bold">* 30초 동안 잡은 물고기 수로 순위가 결정됩니다.</span>
                </div>
              </section>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              \${STATE.selectedStudent ? \`
                <button onclick="restartWithSame()" class="flex-1 py-3 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-black text-base retro-btn cursor-pointer">
                  🎣 다시 낚시하기 (\${STATE.selectedStudent})
                </button>
                <button onclick="changeStudent()" class="flex-1 py-3 bg-[#FEF08A] hover:bg-[#FDE047] text-black font-black text-base retro-btn cursor-pointer">
                  👥 다른 친구 하기 (이름 선택)
                </button>
              \` : \`
                <button onclick="changeStudent()" class="w-full py-3 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-black text-base retro-btn cursor-pointer">
                  🎒 꼬마 낚시꾼 이름 선택하고 낚시하러 가기 👉
                </button>
              \`}
            </div>
          </div>
        </div>
      \`;
    }

    window.openHallOfFame = function() {
      snd.playTap();
      STATE.view = 'RESULT';
      render();
    };

    window.restartWithSame = function() {
      snd.playTap();
      startGame();
    };

    window.changeStudent = function() {
      snd.playTap();
      STATE.selectedStudent = null;
      STATE.selectedAvatar = null;
      STATE.view = 'SELECT_STUDENT';
      render();
    };

    let teacherPinInput = '';

    window.openTeacherModal = function() {
      snd.playTap();
      teacherPinInput = '';
      STATE.passwordModalOpen = true;
      renderPasswordModal();
    };

    window.closePasswordModal = function() {
      snd.playTap();
      teacherPinInput = '';
      STATE.passwordModalOpen = false;
      renderPasswordModal();
    };

    window.pressPinDigit = function(d) {
      snd.playTap();
      if (teacherPinInput.length < 4) {
        teacherPinInput += d;
        updatePinDisplay();
        if (teacherPinInput.length === 4) {
          checkTeacherPin();
        }
      }
    };

    window.clearPin = function() {
      snd.playTap();
      teacherPinInput = '';
      updatePinDisplay();
    };

    window.backspacePin = function() {
      snd.playTap();
      teacherPinInput = teacherPinInput.slice(0, -1);
      updatePinDisplay();
    };

    function updatePinDisplay() {
      const dots = document.getElementById('pin-dots');
      if (dots) {
        dots.innerHTML = [0, 1, 2, 3].map(i => {
          const filled = teacherPinInput.length > i;
          return \`<div class="w-10 h-11 border-2 border-black flex items-center justify-center text-xl font-black \${filled ? 'bg-yellow-300' : 'bg-white text-gray-300'}">\${filled ? '●' : '○'}</div>\`;
        }).join('');
      }
      const err = document.getElementById('pin-error');
      if (err) err.classList.add('hidden');
    }

    function checkTeacherPin() {
      if (teacherPinInput === '2026') {
        snd.playSelect();
        STATE.passwordModalOpen = false;
        renderPasswordModal();
        STATE.teacherModalOpen = true;
        renderTeacherModal();
      } else {
        snd.playWrong();
        const err = document.getElementById('pin-error');
        if (err) {
          err.innerText = '❌ 비밀번호가 올바르지 않습니다. (비밀번호: 2026)';
          err.classList.remove('hidden');
        }
        setTimeout(() => {
          teacherPinInput = '';
          updatePinDisplay();
        }, 500);
      }
    }

    function renderPasswordModal() {
      let modal = document.getElementById('password-modal-container');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'password-modal-container';
        document.body.appendChild(modal);
      }

      if (!STATE.passwordModalOpen) {
        modal.innerHTML = '';
        return;
      }

      modal.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div class="w-full max-w-sm bg-[#FEF9C3] retro-box p-6">
            <div class="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🔒</span>
                <h2 class="text-lg font-black text-black">선생님 확인</h2>
              </div>
              <button onclick="closePasswordModal()" class="w-8 h-8 bg-red-400 text-white font-black border-2 border-black">✕</button>
            </div>

            <p class="text-xs font-bold text-gray-700 text-center mb-3">
              교사 설정에 접근하려면 비밀번호(4자리)를 눌러주세요.
            </p>

            <div id="pin-dots" class="flex justify-center items-center gap-2.5 mb-2">
              <div class="w-10 h-11 border-2 border-black flex items-center justify-center text-xl font-black bg-white text-gray-300">○</div>
              <div class="w-10 h-11 border-2 border-black flex items-center justify-center text-xl font-black bg-white text-gray-300">○</div>
              <div class="w-10 h-11 border-2 border-black flex items-center justify-center text-xl font-black bg-white text-gray-300">○</div>
              <div class="w-10 h-11 border-2 border-black flex items-center justify-center text-xl font-black bg-white text-gray-300">○</div>
            </div>

            <p id="pin-error" class="hidden text-xs font-black text-red-600 text-center mb-3"></p>

            <div class="grid grid-cols-3 gap-2 mb-3">
              \${['1','2','3','4','5','6','7','8','9'].map(d => \`
                <button onclick="pressPinDigit('\${d}')" class="py-2.5 bg-white hover:bg-yellow-100 text-black font-black text-lg border-2 border-black cursor-pointer">\${d}</button>
              \`).join('')}
              <button onclick="clearPin()" class="py-2.5 bg-gray-200 text-black font-black text-xs border-2 border-black cursor-pointer">초기화</button>
              <button onclick="pressPinDigit('0')" class="py-2.5 bg-white hover:bg-yellow-100 text-black font-black text-lg border-2 border-black cursor-pointer">0</button>
              <button onclick="backspacePin()" class="py-2.5 bg-amber-200 text-black font-black text-sm border-2 border-black cursor-pointer">← 지움</button>
            </div>

            <div class="text-center pt-1 border-t border-gray-300">
              <p class="text-[11px] text-gray-500 font-bold">
                선생님 안내: 초기 설정 비밀번호는 <span class="text-blue-700 underline font-mono font-black">2026</span> 입니다.
              </p>
            </div>
          </div>
        </div>
      \`;
    }

    window.closeTeacherModal = function() {
      snd.playTap();
      STATE.teacherModalOpen = false;
      renderTeacherModal();
    };

    function renderTeacherModal() {
      let modal = document.getElementById('teacher-modal-container');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'teacher-modal-container';
        document.body.appendChild(modal);
      }

      if (!STATE.teacherModalOpen) {
        modal.innerHTML = '';
        return;
      }

      const chips = STATE.students.map((s, idx) => \`
        <div class="flex items-center gap-1.5 bg-yellow-100 border-2 border-black px-2 py-0.5 text-xs font-bold">
          <span>\${s}</span>
          <button onclick="removeStudent(\${idx})" class="text-red-500 font-black ml-1 cursor-pointer">×</button>
        </div>
      \`).join('');

      modal.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div class="w-full max-w-lg bg-[#FEF9C3] retro-box p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-2xl">⚙️</span>
                <h2 class="text-xl font-black text-black">선생님 설정 (우리 반 관리)</h2>
              </div>
              <button onclick="closeTeacherModal()" class="w-8 h-8 bg-red-400 text-white font-black border-2 border-black cursor-pointer">✕</button>
            </div>

            <div class="mb-4 bg-white border-2 border-black p-4 shadow-[2px_2px_0px_#000]">
              <h3 class="font-bold text-sm mb-2">🎒 원아 명단 (\${STATE.students.length}명)</h3>
              <div class="flex gap-2 mb-3">
                <input id="new-student-input" type="text" placeholder="새 원아 이름" class="flex-1 px-3 py-1 border-2 border-black text-sm bg-yellow-50" />
                <button onclick="addStudent()" class="px-3 py-1 bg-[#4ADE80] font-black text-xs border-2 border-black cursor-pointer">+ 추가</button>
              </div>
              <div class="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 bg-gray-50 border border-gray-300">
                \${chips}
              </div>
            </div>

            <div class="mb-4 bg-white border-2 border-black p-4 shadow-[2px_2px_0px_#000]">
              <h3 class="font-bold text-sm mb-2">🐟 협동 수족관 물고기 수 관리</h3>
              <div class="flex gap-2 items-center flex-wrap">
                <input id="teacher-fish-input" type="number" value="\${STATE.classFishCount}" class="w-24 px-2 py-1.5 border-2 border-black text-sm font-bold bg-yellow-50" />
                <button onclick="updateClassFish()" class="px-3 py-1.5 bg-sky-300 font-bold text-xs border-2 border-black cursor-pointer">수량 변경</button>
                <button onclick="resetClassFish()" class="px-3 py-1.5 bg-gray-200 text-xs border-2 border-black font-bold cursor-pointer">기본값(0) 리셋</button>
              </div>
            </div>

            <div class="mb-4 bg-white border-2 border-black p-4 shadow-[2px_2px_0px_#000] space-y-2">
              <h3 class="font-bold text-sm">🏆 명예의 전당 점수 관리</h3>
              <div id="reset-leaderboard-feedback" class="hidden p-2 bg-emerald-100 border border-emerald-500 text-emerald-800 text-xs font-bold text-center">
                ✅ 명예의 전당 점수가 초기화되었습니다.
              </div>
              <button onclick="resetLeaderboard()" class="w-full py-2 bg-orange-200 hover:bg-orange-300 font-black text-xs border-2 border-black cursor-pointer">
                🔄 명예의 전당 점수 초기화 (즉시 리셋)
              </button>
              <p class="text-[11px] text-gray-500">* 초기화 시 기존에 기록된 낚시왕 랭킹 기록이 즉시 0건으로 리셋됩니다.</p>
            </div>

            <button onclick="closeTeacherModal()" class="w-full py-2.5 bg-[#FEF08A] hover:bg-[#FDE047] font-black text-sm border-2 border-black cursor-pointer">
              설정 완료하고 닫기
            </button>
          </div>
        </div>
      \`;
    }

    window.addStudent = function() {
      const inp = document.getElementById('new-student-input');
      if (inp && inp.value.trim()) {
        snd.playTap();
        STATE.students.push(inp.value.trim());
        saveState();
        renderTeacherModal();
        if (STATE.view === 'SELECT_STUDENT') render();
      }
    };

    window.removeStudent = function(idx) {
      snd.playTap();
      STATE.students.splice(idx, 1);
      saveState();
      renderTeacherModal();
      if (STATE.view === 'SELECT_STUDENT') render();
    };

    window.updateClassFish = function() {
      const inp = document.getElementById('teacher-fish-input');
      if (inp) {
        snd.playTap();
        STATE.classFishCount = parseInt(inp.value, 10) || 0;
        saveState();
        renderTeacherModal();
        if (STATE.view === 'SELECT_STUDENT' || STATE.view === 'RESULT') render();
      }
    };

    window.resetClassFish = function() {
      snd.playTap();
      STATE.classFishCount = 0;
      saveState();
      const inp = document.getElementById('teacher-fish-input');
      if (inp) inp.value = '0';
      renderTeacherModal();
      if (STATE.view === 'SELECT_STUDENT' || STATE.view === 'RESULT') render();
    };

    window.resetLeaderboard = function() {
      snd.playTap();
      STATE.hallOfFame = [];
      saveState();
      const fb = document.getElementById('reset-leaderboard-feedback');
      if (fb) fb.classList.remove('hidden');
      renderTeacherModal();
      if (STATE.view === 'RESULT') render();
    };

    window.addEventListener('DOMContentLoaded', () => { render(); });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      render();
    }
  </script>
</body>
</html>`;

fs.writeFileSync('public/fishing_game.html', htmlContent);
fs.writeFileSync('standalone_game.html', htmlContent);

const exportedTs = `export const STANDALONE_HTML: string = ${JSON.stringify(htmlContent)};\n`;
fs.writeFileSync('src/standaloneHtmlContent.ts', exportedTs);

console.log('Final updated standalone HTML generated successfully!');
