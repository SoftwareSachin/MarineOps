import { useEffect, useRef } from 'react';
import { PerformanceGaugeData } from '@/types/maritime';

interface GaugeChartProps {
  data: PerformanceGaugeData;
  size?: number;
}

export function GaugeChart({ data, size = 200 }: GaugeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height - 10;
    const radius = 80;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Value arc
    const angle = Math.PI + (data.value / data.max) * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, angle);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 8;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = data.color;
    ctx.fill();

    // Value text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${data.value.toFixed(1)} ${data.unit}`,
      centerX,
      centerY + 25
    );

  }, [data]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size / 2}
        className="gauge-container"
      />
      <div className="text-sm text-muted-foreground mt-2">{data.label}</div>
    </div>
  );
}
