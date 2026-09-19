import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { parsePdfDocument } from '@/lib/pdf-parser-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // In Node.js / Vercel serverless environments, initialize the PDF worker in-process
    // so PDF.js does not attempt to locate or dynamically import external worker files from disk.
    if (!(globalThis as any).pdfjsWorker) {
      try {
        const pdfWorker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
        (globalThis as any).pdfjsWorker = pdfWorker;
      } catch (workerErr) {
        console.warn('Failed to initialize pdfjs worker in-process:', workerErr);
      }
    }

    // Load PDF using pdfjs legacy build for Node.js
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const publicWorker = path.join(process.cwd(), 'public/pdf.worker.mjs');
    const srcWorker = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
    if (pdfjs.GlobalWorkerOptions) {
      if (fs.existsSync(publicWorker)) {
        pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(publicWorker).href;
      } else if (fs.existsSync(srcWorker)) {
        pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(srcWorker).href;
      }
    }

    const doc = await pdfjs.getDocument({
      data: buffer,
      useSystemFonts: true,
      disableFontFace: true,
      isEvalSupported: false
    }).promise;

    const result = await parsePdfDocument(doc);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('PDF extraction error:', err);
    return NextResponse.json({ error: err.message || 'Failed to extract text from PDF' }, { status: 500 });
  }
}
