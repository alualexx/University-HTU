import { useState, useEffect } from 'react';

const useCountUp = (target, duration = 1500, start = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime = null;
    let animationFrameId;

    // Parse target, removing commas if passed as a string like "1,240"
    const numericTarget = typeof target === 'string' 
      ? parseInt(target.replace(/,/g, ''), 10) 
      : target;

    if (isNaN(numericTarget) || numericTarget === 0) {
      setCount(numericTarget || 0);
      return;
    }

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const currentCount = Math.floor((progress / duration) * numericTarget);

      if (progress < duration) {
        setCount(currentCount);
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(numericTarget);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, start]);

  return count;
};

export default useCountUp;
