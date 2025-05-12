// "use server"
// import { NextRequest, NextResponse } from 'next/server';
// import type { NextApiRequest, NextApiResponse } from "next";
// import pdfParse from 'pdf-parse';
// import  {uploadPDF} from "@/lib/s3";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//       try {
//           const file = req.body.file;  // This will still cause an issue
//           const fileName = req.body.fileName;

//           // Check for missing file or fileName
//           if (!file || !fileName) {
//               return res.status(400).json({ success: false, error: "File and fileName are required" });
//           }

//           const key = `pdfs/${Date.now()}_${fileName}`;
//           await uploadPDF(file, key);
//           res.status(200).json({ success: true, key });
//       } catch (error) {
//           console.error(error);
//           res.status(500).json({ success: false, error: (error as Error).message });
//       }
//   } else {
//       res.setHeader("Allow", ["POST"]);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// async function downloadAndParsePdf(url: string): Promise<{ text: string }> {
//   console.log("📥 Fetching PDF:", url);

//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status}`);

//   const arrayBuffer = await res.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   //console.log("🧠 Parsing PDF...");
//   const data = await pdfParse(buffer);
//   // console.log("✅ Parsed pages:", data.numpages);
//   // console.log("✅ Parsed text length:", data.text);
//   return { text: data.text };
// }

// export async function GET(req: NextRequest) {
//   console.log("🚀 /api/parsepdf hit");

//   const { searchParams } = new URL(req.url);
//   const url = searchParams.get('url');

//   console.log("🔍 Query param 'url':", url);

//   if (!url) {
//     console.warn("⚠️ No 'url' query param found");
//     return new Response(
//       JSON.stringify({ error: 'Missing PDF URL' }),
//       { status: 400, headers: { 'Content-Type': 'application/json' } }
//     );
//   }

//   try {
//     console.log("📥 Calling downloadAndParsePdf...");
//     const result = await downloadAndParsePdf(url);

//     console.log("✅ PDF parse success");
//     return new Response(
//       JSON.stringify(result),
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (err: any) {
//     console.error("❌ PDF Parse failed:", err);
//     return new Response(
//       JSON.stringify({ error: err.message || 'Failed to parse PDF' }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForPDF } from "@/lib/s3";
import axios from "axios";
import pdf from "pdf-parse";

export async function GET(req: NextRequest) {
    console.log("⏱️ Received request to /api/parsepdf");

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    console.log("🔑 PDF Key:", key);

    if (!key) {
        console.log("❌ Missing key");
        return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });
    }

    try {
        // Get a signed URL to download the file
        const downloadUrl = await getSignedUrlForPDF(key);
        console.log("🔗 Generated Signed URL for PDF:", downloadUrl);

        // Fetch the PDF file
        const response = await axios.get(downloadUrl, {
            responseType: "arraybuffer",
        });

        console.log("📥 PDF downloaded, parsing...");

        // Parse the PDF
        const data = await pdf(response.data);
        console.log("📝 Parsed PDF text:", data.text);

        return NextResponse.json({ success: true, text: data.text });
    } catch (error) {
        console.error("💥 Error in /api/parsepdf:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
