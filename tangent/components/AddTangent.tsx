"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import db from "@/utils/firestore";
import storage from "@/utils/firestorage";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "./ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { TangentDataSchema, TangentData } from "@/data/tangent";

export default function AddTangent() {
  const [title, setTitle] = useState("");
  const [expand, setExpand] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 1) Validate
    if (!title.trim()) {
      setError("A title is required to deploy the tangent.");
      return;
    }
    if (!file) {
      setError("Please select a PDF to upload.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // 2) Upload PDF to Firebase Storage
      const fileRef = ref(storage, `tangents/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 3) Parse PDF on your backend
      const parseRes = await fetch(
        `/api/parsepdf?url=${encodeURIComponent(downloadURL)}`
      );

      const { text } = await parseRes.json();
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      const today = d.toISOString().split("T")[0];
      const time = `${hh}:${mm}:${ss}`;

      // 4) Call your chattypoo route
      const aiRes = await fetch("/api/chattypoo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
        }),
      });

      // Stream the response
      const reader = aiRes.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullMessage = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullMessage += decoder.decode(value, { stream: true });
      }

      // setResponse(fullMessage);

      // 5) Parse the JSON and save to Firestore
      const tangentJson: TangentData = TangentDataSchema.parse(
        JSON.parse(fullMessage)
      );

      await addDoc(collection(db, "tangents"), {
        title: title.trim(),
        date:today,
        time: time,
        data: tangentJson,
      });
      

      // 6) Reset form
      setTitle("");
      setFile(null);
      setExpand(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!expand ? (
        <div onClick={() => setExpand(true)} className="cursor-pointer">
          <Card className="w-[150px] h-[150px]">
            <CardHeader>
              <CardTitle className="text-center">Add a New Tangent</CardTitle>
              <CardDescription className="text-center">
                <Plus size={48} className="inline-block" color="black" />
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Deploy a New Tangent</CardTitle>
            <CardDescription>Curiosity awaits you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                {/* Title (required!) */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Title *</Label>
                  <Input
                    id="name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the name of your Tangent"
                    required
                  />
                </div>

                {/* Optional instructions switch */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="instructions"
                    checked={instructions}
                    onCheckedChange={setInstructions}
                  />
                  <Label htmlFor="instructions">Instructions</Label>
                </div>

                {/* Conditional instructions textarea */}
                {instructions && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="theme">Theme of Tangent</Label>
                    <Textarea
                      id="theme"
                      placeholder="Enter keywords or topics for the Tangent"
                    />
                  </div>
                )}

                {/* PDF upload (required) */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="pdf">Document *</Label>
                  <Input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    required
                  />
                </div>

                {/* Errors */}
                {error && <div className="text-red-500 text-sm">{error}</div>}

                {/* AI response preview */}
                {response && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="font-semibold mb-2">Response:</h3>
                    <pre className="whitespace-pre-wrap text-sm">
                      {/* {response} */}
                    </pre>
                  </div>
                )}
              </div>

              <Button type="submit" className="mt-4 w-full" disabled={loading}>
                {loading ? "Deploying…" : "Deploy Tangent"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
