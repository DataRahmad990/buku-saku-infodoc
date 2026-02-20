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

const Page = ({ imageUrl, pageNumber }: { imageUrl: string; pageNumber: number }) => {
  return (
    <div className="relative w-full h-full bg-white flex items-center justify-center shadow-lg">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Page ${pageNumber}`}
          className="max-w-full max-h-full object-contain"
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
  const flipbookRef = useRef<any>(null);

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
        <p className="text-xl mb-4">❌ {error}</p>
        <button
          onClick={loadPDF}
          className="px-4 py-2 bg-ojk-red rounded-lg hover:bg-ojk-red-dark"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

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
        <div className="text-white/70 text-xs flex-shrink-0">
          {currentPage + 1} / {totalPages}
        </div>
      </div>

      {/* Flipbook */}
      <div className="flex-1 flex items-center justify-center w-full p-4">
        <HTMLFlipBook
          width={400}
          height={600}
          size="stretch"
          minWidth={300}
          maxWidth={800}
          minHeight={400}
          maxHeight={1000}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          ref={flipbookRef}
          className="shadow-2xl"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showPageCorners={true}
          disableFlipByClick={false}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
        >
          {pages.map((page) => (
            <div key={page.pageNumber} className="page">
              <Page imageUrl={page.imageUrl} pageNumber={page.pageNumber} />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm px-4 py-4 flex items-center justify-center gap-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="text-white text-sm px-4 py-2 bg-white/10 rounded-full">
          Halaman {currentPage + 1}
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
