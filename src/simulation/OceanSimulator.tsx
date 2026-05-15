import React, { useEffect, useRef } from 'react';
import { ModeConfig } from './types';

interface Props {
  mode: ModeConfig;
  prevMode: ModeConfig | null;
  animTick: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, dx: number, dy: number,
  size: number, color: string,
) {
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len; const uy = dy / len;
  const px = -uy; const py = ux;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - ux * size + px * size * 0.45, y - uy * size + py * size * 0.45);
  ctx.lineTo(x - ux * size - px * size * 0.45, y - uy * size - py * size * 0.45);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawUpwellingArrow(
  ctx: CanvasRenderingContext2D,
  x: number, yBottom: number, yTop: number,
  curveX: number, color: string, alpha: number,
  headSize: number, lineWidth: number,
) {
  const cx1 = x + curveX * 0.3; const cy1 = yBottom - (yBottom - yTop) * 0.35;
  const cx2 = x + curveX * 0.8; const cy2 = yBottom - (yBottom - yTop) * 0.65;
  const ex = x + curveX; const ey = yTop;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color; ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = color; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x, yBottom);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey);
  ctx.stroke();
  const t = 0.98;
  const bx = 3 * Math.pow(1 - t, 2) * (cx1 - x) + 6 * (1 - t) * t * (cx2 - cx1) + 3 * t * t * (ex - cx2);
  const by = 3 * Math.pow(1 - t, 2) * (cy1 - yBottom) + 6 * (1 - t) * t * (cy2 - cy1) + 3 * t * t * (ey - cy2);
  drawArrowHead(ctx, ex, ey, bx, by, headSize, color);
  ctx.restore();
}

function drawWindArrow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, length: number,
  color: string, alpha: number, lineWidth: number,
  headSize: number, direction: 1 | -1,
) {
  const ex = x + direction * length;
  ctx.save();
  ctx.globalAlpha = alpha; ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth; ctx.lineCap = 'round';
  ctx.shadowColor = color; ctx.shadowBlur = 6;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, y); ctx.stroke();
  drawArrowHead(ctx, ex, y, direction, 0, headSize, color);
  ctx.restore();
}

export const OceanSimulator: React.FC<Props> = ({ mode, prevMode, animTick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transitionStartRef = useRef<number>(0);
  const prevModeRef = useRef<ModeConfig | null>(null);
  const TRANSITION_TICKS = 54;

  useEffect(() => {
    transitionStartRef.current = animTick;
    prevModeRef.current = prevMode;
  }, [mode.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsed = animTick - transitionStartRef.current;
    const rawT = Math.min(elapsed / TRANSITION_TICKS, 1);
    const t = easeInOut(rawT);

    const W = canvas.width; const H = canvas.height;
    const src = prevModeRef.current ?? mode;
    const dst = mode;

    const tradeWind = lerp(src.tradeWindStrength, dst.tradeWindStrength, t);
    const thermW = lerp(src.thermoclineWest, dst.thermoclineWest, t);
    const thermE = lerp(src.thermoclineEast, dst.thermoclineEast, t);
    const warmW = lerp(src.warmPoolWidth, dst.warmPoolWidth, t);
    const upStr = lerp(src.upwellingStrength, dst.upwellingStrength, t);

    ctx.clearRect(0, 0, W, H);

    const ATM_H = H * 0.32;
    const OCEAN_H = H - ATM_H;
    const OCEAN_Y = ATM_H;
    const LABEL_MARGIN = 48;

    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ATM_H);
    skyGrad.addColorStop(0, '#0f172a'); skyGrad.addColorStop(1, '#1e3a5f');
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, ATM_H);

    // Stars
    ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff';
    const starSeed = [53, 17, 97, 234, 11, 75, 188, 42, 160, 29, 112, 201];
    for (let i = 0; i < starSeed.length; i++) {
      const sx = ((starSeed[i] * 37 + i * 83) % (W - 20)) + 10;
      const sy = ((starSeed[i] * 13 + i * 57) % (ATM_H * 0.6)) + 6;
      const r = 0.8 + (i % 3) * 0.5;
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // Ocean base
    const oceanGrad = ctx.createLinearGradient(0, OCEAN_Y, 0, H);
    oceanGrad.addColorStop(0, '#1e40af'); oceanGrad.addColorStop(0.5, '#1e3a8a'); oceanGrad.addColorStop(1, '#172554');
    ctx.fillStyle = oceanGrad; ctx.fillRect(0, OCEAN_Y, W, OCEAN_H);

    // Thermocline
    const thermYWest = OCEAN_Y + thermW; const thermYEast = OCEAN_Y + thermE;
    const thermPath = new Path2D();
    thermPath.moveTo(0, thermYWest);
    thermPath.bezierCurveTo(W * 0.35, thermYWest + 10, W * 0.65, thermYEast - 10, W, thermYEast);
    thermPath.lineTo(W, H); thermPath.lineTo(0, H); thermPath.closePath();

    const coldGrad = ctx.createLinearGradient(0, OCEAN_Y, 0, H);
    coldGrad.addColorStop(0, '#1e3a8a'); coldGrad.addColorStop(1, '#0c1445');
    ctx.fillStyle = coldGrad; ctx.fill(thermPath);

    // Warm pool
    const poolRight = warmW * (W - LABEL_MARGIN * 2) + LABEL_MARGIN;
    const warmPath = new Path2D();
    warmPath.moveTo(LABEL_MARGIN, OCEAN_Y);
    warmPath.lineTo(poolRight, OCEAN_Y);
    warmPath.bezierCurveTo(poolRight + 30, OCEAN_Y, poolRight + 60, thermYWest + (thermYEast - thermYWest) * warmW, poolRight + 40, thermYWest + (thermYEast - thermYWest) * warmW + 15);
    warmPath.bezierCurveTo(W * 0.4, thermYWest + (thermYEast - thermYWest) * 0.5 + 5, W * 0.1, thermYWest + 5, LABEL_MARGIN, thermYWest);
    warmPath.closePath();

    const warmGrad = ctx.createLinearGradient(0, OCEAN_Y, 0, thermYWest);
    warmGrad.addColorStop(0, 'rgba(239,120,40,0.82)'); warmGrad.addColorStop(0.5, 'rgba(220,90,30,0.6)'); warmGrad.addColorStop(1, 'rgba(180,60,20,0.15)');
    ctx.fillStyle = warmGrad; ctx.fill(warmPath);

    const surfGrad = ctx.createLinearGradient(0, OCEAN_Y, 0, OCEAN_Y + 30);
    surfGrad.addColorStop(0, 'rgba(56,130,230,0.55)'); surfGrad.addColorStop(1, 'rgba(56,130,230,0)');
    ctx.fillStyle = surfGrad; ctx.fillRect(LABEL_MARGIN, OCEAN_Y, W - LABEL_MARGIN * 2, 30);

    // Thermocline line
    ctx.save();
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5; ctx.setLineDash([10, 6]);
    ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(0, thermYWest);
    ctx.bezierCurveTo(W * 0.35, thermYWest + 10, W * 0.65, thermYEast - 10, W, thermYEast);
    ctx.stroke(); ctx.restore();

    ctx.save(); ctx.font = 'bold 11px system-ui, sans-serif'; ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.fillText('THERMOCLINE', W * 0.5, (thermYWest + thermYEast) / 2 - 8); ctx.restore();

    // Wave surface
    ctx.save(); ctx.strokeStyle = 'rgba(147,210,255,0.6)'; ctx.lineWidth = 1.5;
    const waveAmp = 2.5; const waveFreq = 0.025;
    ctx.beginPath();
    for (let wx = LABEL_MARGIN; wx <= W - LABEL_MARGIN; wx++) {
      const wy = OCEAN_Y + Math.sin(wx * waveFreq + animTick * 0.08) * waveAmp;
      if (wx === LABEL_MARGIN) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
    }
    ctx.stroke(); ctx.restore();

    // Upwelling
    if (upStr > 0.05) {
      const upX0 = W - LABEL_MARGIN - 18;
      const upYBottom = OCEAN_Y + OCEAN_H * 0.55;
      const upYTop = OCEAN_Y + 12;
      const arrowCount = 5; const spreadX = 55;
      const pulseBase = (animTick * 0.06) % (Math.PI * 2);
      for (let i = 0; i < arrowCount; i++) {
        const frac = i / (arrowCount - 1);
        const pulse = Math.abs(Math.sin(pulseBase + frac * 1.2));
        const alpha = upStr * (0.55 + pulse * 0.45);
        const lw = 2 + upStr * 2.5; const hs = 9 + upStr * 7;
        const cx = upX0 - frac * spreadX;
        const curveX = -(18 + frac * 22);
        drawUpwellingArrow(ctx, cx, upYBottom, upYTop, curveX, '#22d3ee', alpha, hs, lw);
      }
      ctx.save(); ctx.font = 'bold 10px system-ui, sans-serif'; ctx.fillStyle = '#22d3ee';
      ctx.textAlign = 'right'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
      ctx.globalAlpha = upStr;
      ctx.fillText('UPWELLING', W - LABEL_MARGIN - 4, OCEAN_Y + OCEAN_H * 0.57 + 14); ctx.restore();
    }

    // Walker cell
    if (tradeWind > 0.1) {
      const cellAlpha = tradeWind * 0.7;
      const cellX0 = LABEL_MARGIN + 20; const cellX1 = W - LABEL_MARGIN - 20;
      const cellYTop = ATM_H * 0.18; const cellYBot = OCEAN_Y - 4;
      const cellMidX = lerp(cellX0, cellX1, 0.5);
      ctx.save(); ctx.globalAlpha = cellAlpha * 0.22;
      ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.ellipse(cellMidX, (cellYTop + cellYBot) / 2, (cellX1 - cellX0) * 0.45, (cellYBot - cellYTop) * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke(); ctx.restore();
    }

    // Wind arrows
    const windDir: 1 | -1 = dst.id === 'elnino' && dst.tradeWindStrength < 0.3 ? 1 : -1;
    const windAlpha = 0.55 + tradeWind * 0.45;
    const windColor = dst.id === 'elnino' ? '#fb923c' : '#e2e8f0';
    const ARROW_MARGIN = LABEL_MARGIN + 70;
    const arrowZoneLeft = ARROW_MARGIN; const arrowZoneRight = W - ARROW_MARGIN;
    const arrowZoneWidth = arrowZoneRight - arrowZoneLeft;
    const ROW1_Y = ATM_H * 0.28; const ROW2_Y = ATM_H * 0.72;
    const windLen = 55 + tradeWind * 45; const windSpacing = 110;
    const nArrows = Math.floor(arrowZoneWidth / windSpacing);
    for (let i = 0; i < nArrows; i++) {
      const frac = (i + 0.5) / nArrows;
      const ax = arrowZoneLeft + frac * arrowZoneWidth;
      drawWindArrow(ctx, ax - (windDir * windLen) / 2, ROW1_Y, windLen, windColor, windAlpha, 2, 9, windDir);
      drawWindArrow(ctx, ax - (windDir * windLen) / 2, ROW2_Y, windLen, windColor, windAlpha * 0.75, 1.5, 7, windDir);
    }

    // Precipitation
    const showPrecipWest = t > 0.5 ? dst.precipWest : src.precipWest;
    const showPrecipEast = t > 0.5 ? dst.precipEast : src.precipEast;
    const precipAlpha = t > 0.5 ? (t - 0.5) * 2 : 1 - t * 2;

    const drawRain = (cx: number, width: number, alpha: number) => {
      ctx.save(); ctx.globalAlpha = alpha * 0.7;
      ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 1.2;
      const drops = 18;
      for (let d = 0; d < drops; d++) {
        const rx = cx - width / 2 + (d / drops) * width + ((animTick * 3 + d * 17) % width) - width / 2;
        const ry0 = OCEAN_Y - 30 + ((animTick * 5 + d * 23) % 30);
        ctx.beginPath(); ctx.moveTo(rx, ry0); ctx.lineTo(rx - 2, ry0 + 10); ctx.stroke();
      }
      ctx.restore();
    };

    if (showPrecipWest) drawRain(LABEL_MARGIN + 80, 120, precipAlpha);
    if (showPrecipEast) drawRain(W - LABEL_MARGIN - 80, 120, precipAlpha);

    // Clouds
    const drawCloud = (cx: number, cy: number, scale: number, alpha: number) => {
      ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = '#cbd5e1';
      const circles: [number, number, number][] = [[0, 0, 18 * scale], [-22 * scale, 8 * scale, 14 * scale], [22 * scale, 8 * scale, 14 * scale], [-10 * scale, 12 * scale, 12 * scale], [10 * scale, 12 * scale, 12 * scale]];
      circles.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(cx + x, cy + y, r, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
    };

    const cloudPulse = 0.8 + Math.sin(animTick * 0.04) * 0.2;
    if (showPrecipWest) drawCloud(LABEL_MARGIN + 80, OCEAN_Y - 55, 1.1 * cloudPulse, precipAlpha * 0.9);
    if (showPrecipEast) drawCloud(W - LABEL_MARGIN - 80, OCEAN_Y - 55, 1.1 * cloudPulse, precipAlpha * 0.9);

    // Geo labels
    const geoLabelY = ATM_H * 0.5;
    ctx.save(); ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textBaseline = 'middle'; ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
    ctx.save(); ctx.translate(18, geoLabelY); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.fillText('OUEST', 0, 0); ctx.restore();
    ctx.save(); ctx.translate(W - 18, geoLabelY); ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.fillText('EST', 0, 0); ctx.restore();
    ctx.restore();

    const subLabelY = ATM_H * 0.5 + 26;
    ctx.save(); ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = '#64748b'; ctx.textBaseline = 'top'; ctx.shadowColor = '#000'; ctx.shadowBlur = 3;
    ctx.textAlign = 'left'; ctx.fillText('Australie', 8, subLabelY); ctx.fillText('Indonésie', 8, subLabelY + 13);
    ctx.textAlign = 'right'; ctx.fillText('Pérou', W - 8, subLabelY); ctx.fillText('Équateur', W - 8, subLabelY + 13);
    ctx.restore();

    // Alizés label
    ctx.save(); ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = windColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.globalAlpha = windAlpha; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.fillText(dst.id === 'elnino' ? '← VENTS INVERSÉS →' : '← ALIZÉS', W / 2, ATM_H * 0.5);
    ctx.restore();

    // Temp labels
    ctx.save(); ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textBaseline = 'middle'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.fillStyle = '#fb923c'; ctx.textAlign = 'left'; ctx.globalAlpha = 0.9;
    ctx.fillText('🌡 Eaux chaudes', LABEL_MARGIN + 8, OCEAN_Y + 22);
    ctx.fillStyle = '#93c5fd'; ctx.textAlign = 'right'; ctx.globalAlpha = 0.9;
    ctx.fillText('Eaux froides 🧊', W - LABEL_MARGIN - 8, OCEAN_Y + OCEAN_H * 0.72);
    ctx.restore();

    // Coast walls
    ctx.save(); ctx.strokeStyle = 'rgba(100,116,139,0.5)'; ctx.lineWidth = 3; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(LABEL_MARGIN, OCEAN_Y); ctx.lineTo(LABEL_MARGIN, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - LABEL_MARGIN, OCEAN_Y); ctx.lineTo(W - LABEL_MARGIN, H); ctx.stroke();
    ctx.restore();

    // Depth scale
    ctx.save(); ctx.strokeStyle = 'rgba(100,116,139,0.4)'; ctx.lineWidth = 1;
    ctx.font = '9px system-ui, sans-serif'; ctx.fillStyle = '#64748b'; ctx.textAlign = 'right';
    const depthScale = OCEAN_H / 400;
    [0, 100, 200, 300].forEach((d) => {
      const dy = OCEAN_Y + d * depthScale;
      ctx.beginPath(); ctx.moveTo(W - LABEL_MARGIN, dy); ctx.lineTo(W - LABEL_MARGIN + 6, dy); ctx.stroke();
      ctx.fillText(`${d}m`, W - LABEL_MARGIN - 4, dy + 3);
    });
    ctx.restore();

    // Sep line
    ctx.save(); ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(0, OCEAN_Y); ctx.lineTo(W, OCEAN_Y); ctx.stroke(); ctx.restore();

    // Bottom label
    ctx.save(); ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = '#475569'; ctx.textAlign = 'center';
    ctx.fillText('Coupe transversale — Océan Pacifique Équatorial', W / 2, H - 6);
    ctx.restore();
  }, [mode.id, animTick]);

  return (
    <canvas
      ref={canvasRef}
      width={820}
      height={340}
      className="w-full rounded-xl"
      style={{ display: 'block' }}
    />
  );
};
