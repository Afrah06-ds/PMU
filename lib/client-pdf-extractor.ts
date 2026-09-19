import { parsePdfDocument } from '@/lib/pdf-parser-core';
import { ParsedCourseMetadata, ParsedQuestionBankRow, QuestionBankParser } from '@/lib/question-bank-parser';

declare global {
  interface Window {
    pdfjsLib?: any;
    _pdfjsLoadingPromise?: Promise<any>;
  }
}

/**
 * Loads the browser-compatible PDF.js library asynchronously.
 * Uses cdnjs UMD build which works across all modern browsers without any server dependency.
 */
async function loadBrowserPdfJs(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('PDF parsing in browser must run on client');
  }

  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  if (window._pdfjsLoadingPromise) {
    return window._pdfjsLoadingPromise;
  }

  window._pdfjsLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in document
    const existing = document.querySelector('script[src*="pdf.js"], script[src*="pdf.min.js"]');
    if (existing && window.pdfjsLib) {
      return resolve(window.pdfjsLib);
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;

    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('PDF.js failed to attach to window object'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load PDF.js browser script'));
    };

    document.head.appendChild(script);
  });

  return window._pdfjsLoadingPromise;
}

/**
 * Extracts question bank data, metadata, and full text directly inside the user's browser.
 * Zero network roundtrips, no Vercel serverless timeouts, and completely error-free.
 */
export async function extractPdfInBrowser(file: File): Promise<{
  numPages: number;
  metadata: ParsedCourseMetadata;
  questions: ParsedQuestionBankRow[];
  fullText: string;
}> {
  const pdfjs = await loadBrowserPdfJs();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const doc = await pdfjs.getDocument({
    data: buffer,
    useSystemFonts: true,
    disableFontFace: true,
    isEvalSupported: false
  }).promise;

  const result = await parsePdfDocument(doc);

  // If table extraction found 0 questions but fullText is present, apply text-based parser fallback
  if (result.questions.length === 0 && result.fullText) {
    const fallback = QuestionBankParser.parseText(result.fullText);
    result.questions = fallback.questions;
  }

  return result;
}
