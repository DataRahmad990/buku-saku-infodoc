"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";

// Set worker path
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface FlipbookViewerProps {
  pdfUrl: string;
  title: string;
}

interface PageData {
  pageNumber: number;
  imageUrl: string;
}

const ZOOM_LEVELS = [1, 1.25, 1.5, 2, 2.5, 3];
const DEFAULT_ASPECT = 1.414; // A4 portrait

const Page = ({ imageUrl, pageNumber }: { imageUrl: string; pageNumber: number }) => {
  return (
    <div className="relative w-full h-full bg-gray-900 flex items-center justify-center shadow-lg">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Page ${pageNumber}`}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      ) : (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ojk-red"></div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
        {pageNumber}
      </div>
    </div>
  );
};

export default function FlipbookViewer({ pdfUrl, title }: FlipbookViewerProps) {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageAspect, setPageAspect] = useState<number>(DEFAULT_ASPECT);
  const [dims, setDims] = useState({ width: 500, height: 700 });
  const [zoom, setZoom] = useState(1);
  const flipbookRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Recompute flipbook dimensions based on viewport and PDF aspect ratio
  useEffect(() => {
    const calc = () => {
      if (typeof window === "undefined") return;
      // Reserve space for top header (~56px) and bottom toolbar (~80px) plus padding
      const vh = window.innerHeight - 180;
      const vw = window.innerWidth - 80;

      // Single-page (portrait) view: width = height / aspect
      let height = Math.min(vh, 1600);
      let width = height / pageAspect;

      // If width exceeds half viewport (so spread fits) or full viewport — scale down
      if (width > vw) {
        width = vw;
        height = width * pageAspect;
      }

      setDims({ width: Math.round(width), height: Math.round(height) });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [pageAspect]);

  const loadPDF = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      setTotalPages(pdf.numPages);

      const loadedPages: PageData[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });

        if (pageNum === 1) {
          // Capture aspect ratio of first page
          setPageAspect(viewport.height / viewport.width);
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          const imageUrl = canvas.toDataURL("image/png");
          loadedPages.push({ pageNumber: pageNum, imageUrl });
        }
      }

      setPages(loadedPages);
      setLoading(false);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Gagal memuat PDF. Coba refresh halaman.");
      setLoading(false);
    }
  }, [pdfUrl]);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const goToNextPage = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().flipNext();
    }
  };

  const goToPrevPage = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().flipPrev();
    }
  };

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      const idx = ZOOM_LEVELS.indexOf(z);
      return ZOOM_LEVELS[Math.min(idx + 1, ZOOM_LEVELS.length - 1)] ?? z;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const idx = ZOOM_LEVELS.indexOf(z);
      return ZOOM_LEVELS[Math.max(idx - 1, 0)] ?? z;
    });
  }, []);

  const zoomReset = useCallback(() => setZoom(1), []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        goToPrevPage();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        zoomReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIn, zoomOut, zoomReset]);

  // Reset scroll position when zoom changes back to 1
  useEffect(() => {
    if (zoom === 1 && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, left: 0 });
    }
  }, [zoom]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-4"></div>
        <p className="text-white text-sm">Memuat {title}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <p className="text-xl mb-4">{error}</p>
        <button
          onClick={loadPDF}
          className="px-4 py-2 bg-ojk-red rounded-lg hover:bg-ojk-red-dark"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const minZoom = ZOOM_LEVELS[0];
  const maxZoom = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
  const zoomed = zoom > 1;

  return (
    <div className="relative w-full h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={() => window.close()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          title="Tutup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h1 className="text-white text-sm font-medium truncate flex-1">{title}</h1>
        <div className="text-white/70 text-xs flex-shrink-0 hidden sm:block">
          {currentPage + 1} / {totalPages}
        </div>
      </div>

      {/* Flipbook scroll/pan container */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-auto"
        style={{
          paddingTop: 56,
          paddingBottom: 80,
          scrollbarWidth: "thin",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            minWidth: "100%",
            minHeight: "100%",
            width: zoomed ? `${100 * zoom}%` : "100%",
            height: zoomed ? `${100 * zoom}%` : "100%",
            padding: 16,
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease-out",
            }}
          >
            <HTMLFlipBook
              key={zoomed ? "pan" : "flip"}
              width={dims.width}
              height={dims.height}
              size="stretch"
              minWidth={300}
              maxWidth={1400}
              minHeight={400}
              maxHeight={1800}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onFlip}
              ref={flipbookRef}
              className="shadow-2xl"
              style={{}}
              startPage={currentPage}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.5}
              showPageCorners={!zoomed}
              disableFlipByClick={zoomed}
              clickEventForward={true}
              useMouseEvents={!zoomed}
              swipeDistance={30}
            >
              {pages.map((page) => (
                <div key={page.pageNumber} className="page">
                  <Page imageUrl={page.imageUrl} pageNumber={page.pageNumber} />
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        </div>
      </div>

      {/* Floating Zoom Panel (top-right) */}
      <div className="fixed top-16 right-4 z-50 flex flex-col items-center gap-1 bg-black/60 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl border border-white/10">
        <button
          onClick={zoomIn}
          disabled={zoom >= maxZoom}
          className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
          title="Perbesar (Ctrl +)"
          aria-label="Perbesar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>

        <button
          onClick={zoomReset}
          className="text-white text-[11px] font-semibold px-1 py-1.5 rounded-lg hover:bg-white/15 w-10 text-center transition-colors"
          title="Reset zoom (Ctrl 0)"
          aria-label="Reset zoom"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={zoomOut}
          disabled={zoom <= minZoom}
          className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
          title="Perkecil (Ctrl -)"
          aria-label="Perkecil"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
      </div>

      {/* Bottom Toolbar (page nav) */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm px-4 py-3 flex items-center justify-center gap-3">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
          title="Halaman sebelumnya"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="text-white text-xs sm:text-sm px-3 py-2 bg-white/10 rounded-full whitespace-nowrap">
          {currentPage + 1} / {totalPages}
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
          className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
          title="Halaman berikutnya"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
