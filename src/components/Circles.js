import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';

export const Circles = ({ data }) => {
  const [radius, setRadius] = useState(1);
  const containerRef = useRef(null);
  const x = 100
  const y = 100

  useEffect(() => {
    function updateRadius() {
      setRadius(data);
    }

    const handleResize = debounce(updateRadius, 2000);
    updateRadius();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);


  return (
    <svg width="350" height="350" ref={containerRef}>
      <g id="circle">

        <circle
          key={"asd"}
          r={data < 10 ? 20 : data > 100 ? radius * 0.5 : 60 }
          cx={x}
          cy={y}
          fill='lightgreen'
          text="sd"
        ></circle>
        <text textAnchor="middle" x={x} y={y}>B1</text>
      </g>
    </svg>
  );
};