import { useEffect, useRef } from 'react';

export function WaveBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // Draw multiple wave lines
      for (let i = 0; i < 3; i++) {
        const opacity = 0.1 - i * 0.03;
        const yOffset = height * 0.5 + i * 30;
        const amplitude = 30 - i * 5;
        const frequency = 0.005 + i * 0.001;
        const speed = 0.02 - i * 0.005;

        ctx.beginPath();
        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= width; x += 5) {
          const y = yOffset + Math.sin(x * frequency + time * speed) * amplitude;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(198, 167, 94, ${opacity})`;
        ctx.lineWidth = 2 - i * 0.5;
        ctx.stroke();
      }

      time += 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.5 }}
    />
  );
}
