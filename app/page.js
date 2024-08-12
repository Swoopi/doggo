'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const leftIrisRef = useRef(null);
  const rightIrisRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      const updateIris = (irisRef, eyeCenterX, eyeCenterY) => {
        const deltaX = clientX - eyeCenterX;
        const deltaY = clientY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);

        const maxMovement = 4;
        const moveX = Math.cos(angle) * maxMovement;
        const moveY = Math.sin(angle) * maxMovement - 1;

        irisRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      };

      const leftEye = leftIrisRef.current.getBoundingClientRect();
      const leftEyeCenterX = leftEye.left + leftEye.width / 2;
      const leftEyeCenterY = leftEye.top + leftEye.height / 2;
      updateIris(leftIrisRef, leftEyeCenterX, leftEyeCenterY);

      const rightEye = rightIrisRef.current.getBoundingClientRect();
      const rightEyeCenterX = rightEye.left + rightEye.width / 2;
      const rightEyeCenterY = rightEye.top + rightEye.height / 2;
      updateIris(rightIrisRef, rightEyeCenterX, rightEyeCenterY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleClick = () => {
    router.push('/home');
  };

  return (
    <div className="contenedor" onClick={handleClick}>
      <div className="todo">
        <div className="dog">
          <span className="leg3"></span>
          <div className="body">
            <span className="cola"></span>
            <span className="leg"></span>
          </div>
          <div className="cabezota">
            <div className="orejas">
              <span className="orejitas"></span>
            </div>
            <div className="orejas3">
              <span className="orejitas3"></span>
            </div>
            <div className="cabeza">
              <span className="cabeza3"></span>
              <span className="ojos">
                <span className="iris" ref={leftIrisRef}></span>
              </span>
              <span className="ojos">
                <span className="iris" ref={rightIrisRef}></span>
              </span>
              <span className="nariz"></span>
              <span className="nariz3"></span>
            </div>
          </div>
          <div className="canasta"></div>
        </div>
      </div>
      <h1 className="cta-text">
        Click anywhere to begin!
      </h1>
    </div>
  );
}
