import { useEffect, useState } from "react";
import "./LoadingScreen.css";

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
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="progress-number">{progress}%</div>
      </div>
    </div>
  );
}
