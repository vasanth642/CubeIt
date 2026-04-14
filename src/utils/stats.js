export const DNF = -1;

export const formatTime = (ms) => {
  if (ms === DNF) return "DNF";
  const totalSeconds = Math.floor(ms / 1000);
  const remainderMs = Math.floor((ms % 1000) / 10);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${remainderMs.toString().padStart(2, '0')}`;
  }
  return `${seconds}.${remainderMs.toString().padStart(2, '0')}`;
};

export const calculateAoN = (solves, n) => {
  if (solves.length < n) return null;
  const lastN = solves.slice(-n).map(s => {
    if (s.penalty === -1) return Infinity; // DNF
    return s.timeMs + (s.penalty === 2 ? 2000 : 0);
  });

  const sorted = [...lastN].sort((a, b) => a - b);
  // remove best and worst
  const valid = sorted.slice(1, -1);
  
  if (valid.includes(Infinity)) return DNF; // If inherently DNFing

  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  return Math.floor(sum / valid.length);
};

export const calculateMoN = (solves, n) => {
  if (solves.length < n) return null;
  const lastN = solves.slice(-n).map(s => {
    if (s.penalty === -1) return Infinity;
    return s.timeMs + (s.penalty === 2 ? 2000 : 0);
  });
  
  if (lastN.includes(Infinity)) return DNF;

  const sum = lastN.reduce((acc, curr) => acc + curr, 0);
  return Math.floor(sum / n);
};

export const getSessionAvg = (solves) => {
  if (solves.length === 0) return null;
  const valid = solves.map(s => {
    if (s.penalty === -1) return Infinity;
    return s.timeMs + (s.penalty === 2 ? 2000 : 0);
  }).filter(t => t !== Infinity);
  
  if (valid.length === 0) return DNF;

  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  return Math.floor(sum / valid.length);
};

export const getBest = (solves) => {
  if (solves.length === 0) return null;
  const valid = solves.map(s => {
    if (s.penalty === -1) return Infinity;
    return s.timeMs + (s.penalty === 2 ? 2000 : 0);
  }).filter(t => t !== Infinity);
  
  if (valid.length === 0) return DNF;

  return Math.min(...valid);
};

export const getWorst = (solves) => {
    if (solves.length === 0) return null;
    const valid = solves.map(s => {
      if (s.penalty === -1) return Infinity;
      return s.timeMs + (s.penalty === 2 ? 2000 : 0);
    }).filter(t => t !== Infinity);
    
    if (valid.length === 0) return DNF;
  
    return Math.max(...valid);
};
