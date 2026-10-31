import { useEffect, useState } from "react";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish?.(), 500);
          return 100;
        }

        return prev + 2;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <>
      <style>{`
        .loading-screen {
          --primary: #38bdf8;
          --primary-dark: #0284c7;
          --navy: #1e293b;
          --light-blue: #e0f2fe;
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, #e0f2fe, #f0f9ff, #ffffff);
          overflow: hidden;
        }

        .loading-content {
          width: min(90%, 420px);
          text-align: center;
        }

        .robot-stage {
          position: relative;
          height: 240px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .robot {
          position: relative;
          width: 110px;
          height: 170px;
          animation: robotWalk .7s ease-in-out infinite;
        }

        .robot-head {
          position: absolute;
          top: 0;
          left: 18px;
          width: 74px;
          height: 62px;
          border-radius: 24px;
          background: linear-gradient(145deg, #ffffff, #dbeafe);
          border: 2px solid #7dd3fc;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          box-shadow: 0 8px 25px #38bdf833;
        }

        .robot-eye {
          width: 10px;
          height: 15px;
          border-radius: 50%;
          background: #0284c7;
          box-shadow: 0 0 12px #38bdf8;
          animation: blink 3s infinite;
        }

        .robot-neck {
          position: absolute;
          top: 60px;
          left: 47px;
          width: 18px;
          height: 14px;
          background: #7dd3fc;
          border-radius: 5px;
        }

        .robot-body {
          position: absolute;
          top: 70px;
          left: 20px;
          width: 70px;
          height: 65px;
          border-radius: 22px;
          background: linear-gradient(145deg, #ffffff, #dbeafe);
          border: 2px solid #7dd3fc;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px #38bdf833;
        }

        .robot-heart {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: linear-gradient(135deg, #38bdf8, #0284c7);
          box-shadow: 0 0 15px #38bdf866;
          animation: heartPulse 1.2s infinite;
        }

        .robot-arm {
          position: absolute;
          top: 76px;
          width: 16px;
          height: 55px;
          border-radius: 12px;
          background: linear-gradient(#e0f2fe, #bae6fd);
          border: 2px solid #7dd3fc;
        }

        .robot-arm-left {
          left: 5px;
          transform-origin: top center;
          animation: leftArm .7s infinite;
        }

        .robot-arm-right {
          right: 5px;
          transform-origin: top center;
          animation: rightArm .7s infinite;
        }

        .robot-leg {
          position: absolute;
          top: 128px;
          width: 18px;
          height: 42px;
          border-radius: 10px;
          background: linear-gradient(#bae6fd, #7dd3fc);
          border: 2px solid #38bdf8;
          transform-origin: top center;
        }

        .robot-leg-left {
          left: 29px;
          animation: leftLeg .7s infinite;
        }

        .robot-leg-right {
          right: 29px;
          animation: rightLeg .7s infinite;
        }

        .robot-foot {
          position: absolute;
          bottom: -5px;
          left: -4px;
          width: 27px;
          height: 11px;
          border-radius: 10px;
          background: #0284c7;
        }

        .robot-shadow {
          position: absolute;
          bottom: 18px;
          left: 50%;
          width: 100px;
          height: 18px;
          border-radius: 50%;
          background: #0284c729;
          transform: translateX(-50%);
          filter: blur(5px);
          animation: shadowMove .7s infinite;
        }

        .brand {
          margin-top: 5px;
        }

        .brand span {
          font-family: Georgia, serif;
          font-size: 32px;
          letter-spacing: 8px;
          font-weight: 600;
          color: #1e293b;
        }

        .loading-text {
          margin: 12px 0 20px;
          font-size: 14px;
          color: #64748b;
        }

        .progress-container {
          width: 260px;
          height: 5px;
          margin: auto;
          border-radius: 10px;
          overflow: hidden;
          background: #38bdf833;
        }

        .progress-bar {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg, #38bdf8, #0284c7);
          transition: width .1s linear;
        }

        .progress-number {
          margin-top: 9px;
          font-size: 12px;
          color: #0284c7;
          font-weight: 600;
        }

        @keyframes robotWalk {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-7px) rotate(1deg); }
        }

        @keyframes leftLeg {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-20deg); }
        }

        @keyframes rightLeg {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }

        @keyframes leftArm {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(25deg); }
        }

        @keyframes rightArm {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-20deg); }
        }

        @keyframes shadowMove {
          0%, 100% { transform: translateX(-50%) scaleX(1); }
          50% { transform: translateX(-50%) scaleX(.75); }
        }

        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        @keyframes blink {
          0%, 45%, 50%, 100% { transform: scaleY(1); }
          47% { transform: scaleY(.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .robot, .robot-eye, .robot-heart, .robot-arm,
          .robot-leg, .robot-shadow {
            animation: none !important;
          }
        }

        @media (max-width: 600px) {
          .brand span {
            font-size: 26px;
            letter-spacing: 6px;
          }
        }
      `}</style>

      <div className="loading-screen">
        <div className="loading-content">
          <div className="robot-stage">
            <div className="robot">
              <div className="robot-head">
                <div className="robot-eye"></div>
                <div className="robot-eye"></div>
              </div>

              <div className="robot-neck"></div>

              <div className="robot-body">
                <div className="robot-heart">✦</div>
              </div>

              <div className="robot-arm robot-arm-left"></div>
              <div className="robot-arm robot-arm-right"></div>

              <div className="robot-leg robot-leg-left">
                <div className="robot-foot"></div>
              </div>

              <div className="robot-leg robot-leg-right">
                <div className="robot-foot"></div>
              </div>
            </div>

            <div className="robot-shadow"></div>
          </div>

          <div className="brand">
            <span>LEDORA</span>
          </div>

          <p className="loading-text">Preparing your beauty experience</p>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="progress-number">{progress}%</div>
        </div>
      </div>
    </>
  );
}
