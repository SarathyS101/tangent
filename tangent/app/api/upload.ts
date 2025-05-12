import type { NextApiRequest, NextApiResponse } from "next";
import { generateUploadURL } from "@/lib/s3";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("⏱️ Received request to /api/upload");

    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        console.log("❌ Method not allowed");
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { fileName } = req.body;
        console.log("📂 File Name:", fileName);

        if (!fileName) {
            console.log("❌ Missing file name");
            return res.status(400).json({ success: false, error: "fileName is required" });
        }

        const key = `tangents/${Date.now()}_${fileName}`;
        const signedUrl = await generateUploadURL(key, "application/pdf");
        console.log("🔗 Generated Signed URL:", signedUrl);

        res.status(200).json({ success: true, signedUrl, key });
    } catch (error) {
        console.error("💥 Error in /api/upload:", error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
}
