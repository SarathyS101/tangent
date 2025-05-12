import { NextRequest, NextResponse } from "next/server";
import { generateUploadURL } from "@/lib/s3";

export async function POST(req: NextRequest) {
    console.log("⏱️ Received request to /api/upload");

    try {
        const { fileName } = await req.json();
        console.log("📂 File Name:", fileName);

        if (!fileName) {
            console.log("❌ Missing file name");
            return NextResponse.json({ success: false, error: "fileName is required" }, { status: 400 });
        }

        const key = `tangents/${Date.now()}_${fileName}`;
        const signedUrl = await generateUploadURL(key, "application/pdf");
        console.log("🔗 Generated Signed URL:", signedUrl);

        return NextResponse.json({ success: true, signedUrl, key });
    } catch (error) {
        console.error("💥 Error in /api/upload:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
