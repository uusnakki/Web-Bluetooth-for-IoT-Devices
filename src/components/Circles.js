import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';

export const Circles = ({ data }) => {
  const [radius, setRadius] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    function updateRadius() {
      setRadius(data);
    }

    const handleResize = debounce(updateRadius, 1000);
    updateRadius();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  return (
    <svg width="100%" height="350" ref={containerRef}>
      <g transform="translate(0, 100)">

        <circle
          key={"asd"}
          r={radius * 20}
          cx={260}
          cy={50}
          fill='#4222f'
        ></circle>

      </g>
    </svg>
  );
};