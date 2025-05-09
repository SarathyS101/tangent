"use server"
import { NextRequest } from 'next/server';
import pdfParse from 'pdf-parse';

async function downloadAndParsePdf(url: string): Promise<{ text: string }> {
  console.log("📥 Fetching PDF:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status}`);

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log("🧠 Parsing PDF...");
  const data = await pdfParse(buffer);
  console.log("✅ Parsed pages:", data.numpages);

  return { text: data.text };
}

export async function GET(req: NextRequest) {
  console.log("🚀 /api/parsepdf hit");

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  console.log("🔍 Query param 'url':", url);

  if (!url) {
    console.warn("⚠️ No 'url' query param found");
    return new Response(
      JSON.stringify({ error: 'Missing PDF URL' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    console.log("📥 Calling downloadAndParsePdf...");
    const result = await downloadAndParsePdf(url);

    console.log("✅ PDF parse success");
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error("❌ PDF Parse failed:", err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to parse PDF' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
