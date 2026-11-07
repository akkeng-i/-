export function hasBatchim(str: string): boolean {
  if (!str) return false;
  const lastChar = str.charCodeAt(str.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return false;
  return (lastChar - 0xac00) % 28 !== 0;
}

export function getGivenName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return '친구';
  if (trimmed.length >= 3) {
    return trimmed.slice(1);
  }
  const commonSurnames = '김이박최정강조윤장임한오서신권황안송전홍고문손양배백허유남심노하곽성차주우구민진지엄채원천방공현함변염';
  if (trimmed.length === 2 && commonSurnames.includes(trimmed[0])) {
    return trimmed.slice(1);
  }
  return trimmed;
}

export function formatPraise(fullName: string, word: string): string {
  const given = getGivenName(fullName);
  const vocative = hasBatchim(given) ? '아' : '야';
  return `${given}${vocative} 축하해! 🎉 '${word}' 완성!`;
}

export function formatResultSubject(fullName: string): string {
  const given = getGivenName(fullName);
  const particle = hasBatchim(given) ? '이는' : '는';
  return `${given}${particle} 오늘`;
}
