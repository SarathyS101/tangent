import type { NextApiRequest, NextApiResponse } from "next";
import { getSignedUrlForPDF } from "@/lib/s3";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("⏱️ Received request to /api/parsepdf");

    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        console.log("❌ Method not allowed");
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { key } = req.query;
        console.log("🔑 PDF Key:", key);

        if (!key) {
            console.log("❌ Missing key");
            return res.status(400).json({ success: false, error: "Key is required" });
        }

        // Generate a signed URL for downloading the PDF
        const downloadUrl = await getSignedUrlForPDF(key as string);
        console.log("🔗 Generated Signed URL:", downloadUrl);

        // Placeholder for actual PDF parsing logic
        // TODO: Replace this with real parsing logic
        res.status(200).json({ success: true, downloadUrl });
    } catch (error) {
        console.error("💥 Error in /api/parsepdf:", error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
}
