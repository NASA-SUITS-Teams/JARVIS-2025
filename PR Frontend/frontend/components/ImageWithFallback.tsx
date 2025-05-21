import { useState, useEffect, useRef } from 'react';

export const ImageWithFallback = ({ src, fallbackSrc }) => {
  const [srcToUse, setSrcToUse] = useState(src);
  const imgLoadedOnInitSrc = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!imgLoadedOnInitSrc.current) setSrcToUse(fallbackSrc);
    }, 3000);

    return () => clearTimeout(timer);
  }, [fallbackSrc]);

  return (
    <img
      src={srcToUse}
      onLoad={() => {
        imgLoadedOnInitSrc.current = true;
      }}
    />
  );
};
