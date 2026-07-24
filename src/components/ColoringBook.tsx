import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, 
  Printer, 
  Download, 
  RotateCcw, 
  Sparkles, 
  X, 
  Brush, 
  Eraser, 
  PaintBucket, 
  Undo2,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { Story } from '../types';

interface ColoringBookProps {
  story: Story;
  onClose: () => void;
}

const COLOR_PALETTE = [
  { name: 'Kırmızı', value: '#ef4444' },
  { name: 'Pembe', value: '#ec4899' },
  { name: 'Turuncu', value: '#f97316' },
  { name: 'Sarı', value: '#f59e0b' },
  { name: 'Fıstık Yeşili', value: '#84cc16' },
  { name: 'Koyu Yeşil', value: '#10b981' },
  { name: 'Gökyüzü Mavisi', value: '#38bdf8' },
  { name: 'Okyanus Mavisi', value: '#3b82f6' },
  { name: 'Mor', value: '#a855f7' },
  { name: 'Kahverengi', value: '#78350f' },
  { name: 'Siyah', value: '#0f172a' },
  { name: 'Beyaz', value: '#ffffff' },
];

export const ColoringBook: React.FC<ColoringBookProps> = ({ story, onClose }) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('#ef4444');
  const [toolMode, setToolMode] = useState<'fill' | 'brush' | 'eraser'>('fill');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lineArtLoaded, setLineArtLoaded] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const currentChapter = story.chapters[activeChapterIdx] || story.chapters[0];

  // Outline generator
  const getLineArtUrl = (idx: number) => {
    const raw = currentChapter?.imagePrompt || `${story.title} chapter ${idx + 1}`;
    const cleanPrompt = raw.replace(/[^a-zA-Z0-9 ,]/g, '');
    const seed = (story.id.length * 777) + (idx * 333) + 42;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(
      `coloring book line art for children, black lines on pure white background, simple vector outline, disney style, no shade, high contrast, ${cleanPrompt}`
    )}?width=800&height=500&nologo=true&seed=${seed}`;
  };

  const lineArtUrl = getLineArtUrl(activeChapterIdx);

  // Helper to push state to history stack for Undo
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), imgData]);
  };

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    ctx.putImageData(previousState, 0, 0);
  };

  // Load line art into Canvas
  useEffect(() => {
    setLineArtLoaded(false);
    setHistory([]);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = lineArtUrl;

    img.onload = () => {
      canvas.width = 800;
      canvas.height = 500;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 800, 500);
      setLineArtLoaded(true);
    };

    img.onerror = () => {
      // Fallback line art template if image fails
      canvas.width = 800;
      canvas.height = 500;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 500);
      
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(30, 30, 740, 440);
      
      // Draw simple castle/sun template
      ctx.beginPath();
      ctx.arc(150, 120, 40, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeRect(300, 200, 200, 200);
      ctx.beginPath();
      ctx.moveTo(300, 200);
      ctx.lineTo(400, 100);
      ctx.lineTo(500, 200);
      ctx.closePath();
      ctx.stroke();

      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(`${story.title} - Boyama Sayfası`, 400, 460);
      setLineArtLoaded(true);
    };
  }, [lineArtUrl, activeChapterIdx, story]);

  // Flood Fill (Bucket tool algorithm)
  const performFloodFill = (startX: number, startY: number, fillColorHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveCanvasState();

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Parse fill color
    const tempElem = document.createElement('div');
    tempElem.style.color = fillColorHex;
    document.body.appendChild(tempElem);
    const rgbStr = window.getComputedStyle(tempElem).color;
    document.body.removeChild(tempElem);
    
    const rgbMatches = rgbStr.match(/\d+/g);
    if (!rgbMatches) return;
    const fillR = parseInt(rgbMatches[0], 10);
    const fillG = parseInt(rgbMatches[1], 10);
    const fillB = parseInt(rgbMatches[2], 10);

    const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    // Don't fill if target is black line (outline) or same color
    if (startR < 50 && startG < 50 && startB < 50) return; // Ignore dark line borders
    if (startR === fillR && startG === fillG && startB === fillB) return;

    const colorMatch = (pos: number) => {
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const a = data[pos + 3];

      // Match within color tolerance and avoid dark outline
      if (r < 50 && g < 50 && b < 50) return false;
      return Math.abs(r - startR) < 40 && Math.abs(g - startG) < 40 && Math.abs(b - startB) < 40;
    };

    const pixelStack: [number, number][] = [[Math.floor(startX), Math.floor(startY)]];

    while (pixelStack.length > 0) {
      const newPos = pixelStack.pop()!;
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = (y * width + x) * 4;

      while (y >= 0 && colorMatch(pixelPos)) {
        y--;
        pixelPos -= width * 4;
      }

      pixelPos += width * 4;
      y++;

      let reachLeft = false;
      let reachRight = false;

      while (y < height && colorMatch(pixelPos)) {
        data[pixelPos] = fillR;
        data[pixelPos + 1] = fillG;
        data[pixelPos + 2] = fillB;
        data[pixelPos + 3] = 255;

        if (x > 0) {
          if (colorMatch(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < width - 1) {
          if (colorMatch(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        y++;
        pixelPos += width * 4;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Drawing Event Handlers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    if (toolMode === 'fill') {
      performFloodFill(x, y, selectedColor);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (toolMode === 'fill') {
      handleCanvasClick(e);
      return;
    }
    saveCanvasState();
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || toolMode === 'fill') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (toolMode === 'eraser') {
      ctx.strokeStyle = '#ffffff';
    } else {
      ctx.strokeStyle = selectedColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleResetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveCanvasState();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = lineArtUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 800, 500);
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${story.title}-Boyama-${activeChapterIdx + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border-2 border-purple-300 dark:border-slate-700 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-3 sm:p-6 space-y-4 print:border-none print:shadow-none print:w-full print:p-0 print:max-h-none relative"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 text-white rounded-2xl shadow-md">
              <Palette className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Eğlenceli Boyama Atölyesi</span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                  Sihirli Kovayla Boya 🪣
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Alana tıklayarak kovayla renklendirin, fırçayla çizin veya çıktısını alıp evde boyayın!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-700 dark:text-slate-200 rounded-full cursor-pointer transition shadow-xs"
            title="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chapter & Line Art Selector */}
        {story.chapters.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 print:hidden">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Şablon / Bölüm:</span>
            {story.chapters.map((ch, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveChapterIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  activeChapterIdx === idx
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {ch.chapterTitle || `${idx + 1}. Görsel`}
              </button>
            ))}
          </div>
        )}

        {/* Interactive Toolkit Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 print:hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Tool Mode Buttons (Bucket / Brush / Eraser) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setToolMode('fill')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5 border transition ${
                  toolMode === 'fill'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200'
                }`}
              >
                <PaintBucket className="w-4 h-4 text-amber-300" />
                <span>Sihirli Kova</span>
              </button>

              <button
                type="button"
                onClick={() => setToolMode('brush')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5 border transition ${
                  toolMode === 'brush'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200'
                }`}
              >
                <Brush className="w-4 h-4 text-sky-300" />
                <span>Fırça</span>
              </button>

              <button
                type="button"
                onClick={() => setToolMode('eraser')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5 border transition ${
                  toolMode === 'eraser'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200'
                }`}
              >
                <Eraser className="w-4 h-4 text-pink-400" />
                <span>Silgi</span>
              </button>
            </div>

            {/* Brush Sizes (If in brush or eraser mode) */}
            {toolMode !== 'fill' && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Kalınlık:</span>
                {[4, 10, 20].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setBrushSize(sz)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs cursor-pointer transition ${
                      brushSize === sz
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border'
                    }`}
                  >
                    {sz === 4 ? 'S' : sz === 10 ? 'M' : 'L'}
                  </button>
                ))}
              </div>
            )}

            {/* Undo & Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-40 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1"
                title="Geri Al"
              >
                <Undo2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Geri Al</span>
              </button>

              <button
                type="button"
                onClick={handleResetCanvas}
                className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                title="Sıfırla"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            </div>

          </div>

          {/* Color Palette Swatches */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mr-1 shrink-0">
              Renk Seç:
            </span>

            {COLOR_PALETTE.map((col) => (
              <button
                key={col.value}
                type="button"
                onClick={() => setSelectedColor(col.value)}
                style={{ backgroundColor: col.value }}
                className={`w-7 h-7 rounded-full shrink-0 transition transform cursor-pointer flex items-center justify-center border-2 ${
                  selectedColor === col.value
                    ? 'scale-125 border-slate-900 dark:border-white shadow-md ring-2 ring-purple-500/50'
                    : 'border-white/60 hover:scale-110'
                }`}
                title={col.name}
              >
                {selectedColor === col.value && (
                  <Check className={`w-3.5 h-3.5 ${col.value === '#ffffff' || col.value === '#f59e0b' || col.value === '#84cc16' ? 'text-slate-950' : 'text-white'}`} />
                )}
              </button>
            ))}
          </div>

        </div>

        {/* Canvas & Printable View */}
        <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-slate-300 shadow-inner flex items-center justify-center min-h-[350px] sm:min-h-[460px]">
          
          {!lineArtLoaded && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center space-y-2 z-10 print:hidden">
              <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs font-bold text-slate-700">
                Siyah-Beyaz Çizim Şablonu Yükleniyor...
              </p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className={`w-full h-auto max-h-[480px] object-contain touch-none bg-white ${
              toolMode === 'fill' ? 'cursor-pointer' : 'cursor-crosshair'
            }`}
          />
        </div>

        {/* Bottom Bar Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 print:hidden">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            💡 <strong>Nasıl Boyanır?:</strong> Sihirli kova ile alana tıklayınca tüm bölge boyanır.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır 🖨️</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Resmi İndir</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
