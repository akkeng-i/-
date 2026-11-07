import { WordItem } from './types';

export const WORD_POOL: WordItem[] = [
  { id: '1', word: '사과', emoji: '🍎', hint: '아삭아삭 달콤한 과일', missingIndex: 0, targetChar: '사', givenChar: '과', distractors: ['나', '가', '바', '마'] },
  { id: '2', word: '포도', emoji: '🍇', hint: '송이송이 달린 보라색 과일', missingIndex: 1, targetChar: '도', givenChar: '포', distractors: ['로', '고', '보', '소'] },
  { id: '3', word: '딸기', emoji: '🍓', hint: '빨갛고 새콤달콤한 과일', missingIndex: 0, targetChar: '딸', givenChar: '기', distractors: ['달', '말', '발', '알'] },
  { id: '4', word: '수박', emoji: '🍉', hint: '초록 줄무늬 시원한 과일', missingIndex: 1, targetChar: '박', givenChar: '수', distractors: ['락', '각', '막', '낙'] },
  { id: '5', word: '우유', emoji: '🥛', hint: '키가 쑥쑥 하얀 음료', missingIndex: 1, targetChar: '유', givenChar: '우', distractors: ['구', '무', '누', '루'] },
  { id: '6', word: '토끼', emoji: '🐰', hint: '귀가 쫑긋 깡충깡충', missingIndex: 0, targetChar: '토', givenChar: '끼', distractors: ['도', '로', '고', '포'] },
  { id: '7', word: '사자', emoji: '🦁', hint: '어흥! 멋진 갈기의 동물의 왕', missingIndex: 1, targetChar: '자', givenChar: '사', distractors: ['차', '라', '마', '가'] },
  { id: '8', word: '오리', emoji: '🦆', hint: '뒤뚱뒤뚱 꽥꽥 물새', missingIndex: 0, targetChar: '오', givenChar: '리', distractors: ['아', '어', '우', '이'] },
  { id: '9', word: '나비', emoji: '🦋', hint: '꽃밭을 팔랑팔랑 날아요', missingIndex: 1, targetChar: '비', givenChar: '나', distractors: ['기', '미', '시', '디'] },
  { id: '10', word: '여우', emoji: '🦊', hint: '꼬리가 퐁퐁 동물 친구', missingIndex: 0, targetChar: '여', givenChar: '우', distractors: ['야', '요', '유', '어'] },
  { id: '11', word: '기차', emoji: '🚂', hint: '칙칙폭폭 레일 위를 달려요', missingIndex: 1, targetChar: '차', givenChar: '기', distractors: ['가', '다', '사', '자'] },
  { id: '12', word: '버스', emoji: '🚌', hint: '부릉부릉 다 같이 타요', missingIndex: 1, targetChar: '스', givenChar: '버', distractors: ['트', '드', '르', '브'] },
  { id: '13', word: '모자', emoji: '🧢', hint: '머리에 쏘옥 햇빛을 가려요', missingIndex: 0, targetChar: '모', givenChar: '자', distractors: ['포', '고', '보', '소'] },
  { id: '14', word: '구두', emoji: '👞', hint: '발에 신는 반짝반짝 신발', missingIndex: 1, targetChar: '두', givenChar: '구', distractors: ['루', '수', '무', '주'] },
  { id: '15', word: '나무', emoji: '🌳', hint: '초록 잎사귀 시원한 그늘', missingIndex: 1, targetChar: '무', givenChar: '나', distractors: ['구', '두', '루', '수'] },
  { id: '16', word: '바다', emoji: '🌊', hint: '파도가 찰랑찰랑 푸른 물', missingIndex: 0, targetChar: '바', givenChar: '다', distractors: ['마', '사', '가', '나'] },
  { id: '17', word: '고래', emoji: '🐳', hint: '푸우~ 물을 뿜는 바다 친구', missingIndex: 0, targetChar: '고', givenChar: '래', distractors: ['도', '로', '포', '조'] },
  { id: '18', word: '치즈', emoji: '🧀', hint: '노랗고 고소한 네모 간식', missingIndex: 1, targetChar: '즈', givenChar: '치', distractors: ['크', '트', '드', '브'] },
  { id: '19', word: '감자', emoji: '🥔', hint: '땅속에서 퐁퐁 포슬포슬', missingIndex: 0, targetChar: '감', givenChar: '자', distractors: ['남', '담', '람', '삼'] },
  { id: '20', word: '비누', emoji: '🧼', hint: '뽀득뽀득 거품이 보글보글', missingIndex: 0, targetChar: '비', givenChar: '누', distractors: ['기', '니', '디', '리'] },
  { id: '21', word: '아기', emoji: '👶', hint: '방긋방긋 웃는 귀여운 천사', missingIndex: 0, targetChar: '아', givenChar: '기', distractors: ['오', '우', '어', '이'] },
  { id: '22', word: '의자', emoji: '🪑', hint: '엉덩이를 붙이고 편히 앉아요', missingIndex: 0, targetChar: '의', givenChar: '자', distractors: ['이', '으', '에', '오'] },
  { id: '23', word: '시계', emoji: '⏰', hint: '똑딱똑딱 시간을 알려줘요', missingIndex: 0, targetChar: '시', givenChar: '계', distractors: ['기', '니', '디', '리'] },
  { id: '24', word: '하마', emoji: '🦛', hint: '입이 쩌억! 물을 좋아해요', missingIndex: 1, targetChar: '마', givenChar: '하', distractors: ['바', '사', '가', '다'] },
  { id: '25', word: '오이', emoji: '🥒', hint: '초록색 길쭉길쭉 아삭 채소', missingIndex: 1, targetChar: '이', givenChar: '오', distractors: ['아', '어', '우', '으'] },
  { id: '26', word: '가지', emoji: '🍆', hint: '매끄러운 보라 채소', missingIndex: 0, targetChar: '가', givenChar: '지', distractors: ['나', '다', '라', '마'] },
  { id: '27', word: '양말', emoji: '🧦', hint: '발이 따뜻하게 쏙 신어요', missingIndex: 1, targetChar: '말', givenChar: '양', distractors: ['달', '발', '갈', '날'] },
  { id: '28', word: '당근', emoji: '🥕', hint: '토끼가 좋아하는 주황 채소', missingIndex: 0, targetChar: '당', givenChar: '근', distractors: ['상', '방', '강', '장'] },
  { id: '29', word: '거북', emoji: '🐢', hint: '단단한 등껍질 느릿느릿', missingIndex: 0, targetChar: '거', givenChar: '북', distractors: ['더', '서', '저', '너'] },
  { id: '30', word: '양파', emoji: '🧅', hint: '동글동글 껍질 까는 채소', missingIndex: 1, targetChar: '파', givenChar: '양', distractors: ['마', '바', '사', '가'] },
  { id: '31', word: '고추', emoji: '🌶️', hint: '매콤하고 알싸한 채소', missingIndex: 1, targetChar: '추', givenChar: '고', distractors: ['루', '수', '무', '주'] },
  { id: '32', word: '치마', emoji: '👗', hint: '살랑살랑 예쁜 옷', missingIndex: 0, targetChar: '치', givenChar: '마', distractors: ['기', '디', '리', '시'] },
  { id: '33', word: '피리', emoji: '🪈', hint: '삐뽀삐뽀 고운 소리 악기', missingIndex: 0, targetChar: '피', givenChar: '리', distractors: ['지', '치', '키', '티'] },
  { id: '34', word: '풍선', emoji: '🎈', hint: '하늘로 둥실 날아가는 놀이', missingIndex: 1, targetChar: '선', givenChar: '풍', distractors: ['천', '건', '번', '전'] },
  { id: '35', word: '장화', emoji: '👢', hint: '비 오는 날 신는 신발', missingIndex: 0, targetChar: '장', givenChar: '화', distractors: ['상', '방', '강', '당'] },
  { id: '36', word: '침대', emoji: '🛏️', hint: '쿨쿨 포근하게 잠을 자요', missingIndex: 0, targetChar: '침', givenChar: '대', distractors: ['김', '림', '심', '임'] },
  { id: '37', word: '휴지', emoji: '🧻', hint: '손을 쓱쓱 깨끗이 닦아요', missingIndex: 0, targetChar: '휴', givenChar: '지', distractors: ['유', '류', '슈', '주'] },
  { id: '38', word: '참외', emoji: '🍈', hint: '노란 옷에 하얀 줄무늬 과일', missingIndex: 0, targetChar: '참', givenChar: '외', distractors: ['남', '담', '람', '삼'] }
];

export function getRandomWordList(): WordItem[] {
  return [...WORD_POOL].sort(() => Math.random() - 0.5);
}
