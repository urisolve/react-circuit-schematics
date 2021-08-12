import { useMemo, useEffect, useRef, useState } from 'react';
import lodash from 'lodash';

export const useMousePosition = (ref, fps = 30) => {
  const [mousePosition, setMousePosition] = useState({ x: NaN, y: NaN });
  const area = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    area.current = ref.current.getBoundingClientRect();
  }, [ref, area]);

  const calcMousePosition = useMemo(
    () =>
      lodash.throttle((event) => {
        setMousePosition({
          x: Math.floor(event.pageX - area.current.left),
          y: Math.floor(event.pageY - area.current.top),
        });
      }, 1000 / fps),
    [setMousePosition, fps, area],
  );

  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener('mousemove', calcMousePosition);
    const cleanup = ref;

    return () => {
      if (!cleanup.current) return;
      cleanup.current.removeEventListener('mousemove', calcMousePosition);
      calcMousePosition.cancel();
    };
  }, [ref, calcMousePosition]);

  return mousePosition;
};
