"use client";
import { useState } from "react";
import storage from "@/utils/firestorage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const upload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Uploading:", file);

    const fileRef = ref(storage, `test/${file.name}`);
    try {
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File available at:", downloadURL);
      const res = await fetch(
        `/api/parsepdf?url=${encodeURIComponent(downloadURL)}`
      );
      const data = await res.json();

      if (res.ok) {
        console.log("Parsed text:", data.text);
      } else {
        console.error("Parsing error:", data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          setFile(selectedFile || null);
        }}
      ></input>
      <button onClick={upload}>Upload</button>
    </div>
  );
}
