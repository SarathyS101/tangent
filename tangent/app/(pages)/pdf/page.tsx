"use client";

import { useState } from "react";

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadStatus("");
            console.log("📂 File selected:", e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            console.log("🔗 Requesting signed URL...");
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileName: file.name }),
            });

            const data = await res.json();
            console.log("📝 API response body:", data);

            if (!data.success) throw new Error(data.error);

            const uploadURL = data.signedUrl;
            const s3Key = data.key;

            // Upload the file to S3
            console.log("📤 Uploading to S3...");
            const uploadRes = await fetch(uploadURL, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            console.log("🚀 Upload response status:", uploadRes.status);

            if (!uploadRes.ok) {
                console.error("💥 S3 Upload failed", uploadRes);
                throw new Error("Failed to upload to S3");
            }

            // Call the parsepdf endpoint
            console.log("🔎 Requesting PDF parsing...");
            const parseRes = await fetch(`/api/parsepdf?key=${encodeURIComponent(s3Key)}`);
            const parseData = await parseRes.json();

            console.log("📊 Parsing response:", parseData);

            if (!parseData.success) throw new Error(parseData.error);

            setUploadStatus(`File uploaded and parsed successfully! Extracted text: ${parseData.text}`);
        } catch (error) {
            setUploadStatus(`Error: ${error}`);
            console.error("💥 Upload error:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Upload PDF</h1>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file} style={{ marginLeft: "10px" }}>
                Upload PDF
            </button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
}
