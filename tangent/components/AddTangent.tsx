"use client";
import { useState } from "react";
import db from "@/utils/firestore";
import { collection, addDoc } from "@firebase/firestore";
import storage from "@/utils/firestorage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
export default function AddTangent() {
  const [value, setValue] = useState("");
  const [expand, setExpand] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const help = async (event: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(event);
    upload();
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "items"), {
        name: value,
      });
      console.log("Document written with ID: ", docRef.id);
      setValue(""); // Clear input after adding
    } catch (err) {
      console.log("Error: ", err);
    }
  };
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
        const parsedText = data.text;
        setResponse(parsedText);
        console.log("Parsed text:", parsedText);

        // 👇 Call OpenAI route with the parsed text
        const openaiRes = await fetch("/api/chattypoo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: parsedText,
              },
            ],
          }),
        });

        const reader = openaiRes.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let fullMessage = "";

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          fullMessage += decoder.decode(value, { stream: true });
          ;
        }

        console.log("OpenAI Response:", fullMessage);
        setResponse(fullMessage);
      } else {
        console.error("Parsing error:", data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <>
      {!expand && (
        <div onClick={() => setExpand(!expand)} className="cursor-pointer">
          <Card className="w-[150px] h-[150px]">
            <CardHeader>
              <CardTitle className="text-center ">Add a New Tangent</CardTitle>
              <CardDescription className="text-center">
                <Plus size={48} className="inline-block" color="black" />
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}
      {expand && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Deploy a New Tangent</CardTitle>
            <CardDescription>Curiosity awaits you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={help}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Title</Label>
                  <Input
                    id="name"
                    placeholder="Enter the name of your Tangent"
                  />
                </div>
                <div className="flex flex-row space-x-1.5">
                  <Switch
                    id="instructions"
                    checked={instructions}
                    onCheckedChange={() => setInstructions(!instructions)}
                  />
                  <Label htmlFor="instructions">Instructions</Label>
                </div>

                {instructions && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="title">Theme of Tangent</Label>
                    <Textarea placeholder="Enter keywords, topics of discussion, etc. that you would like the Tangent to address" />
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="pdf">Document</Label>
                  <Input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      setFile(selectedFile || null);
                    }}
                  />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {response && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="font-semibold mb-2">Response:</h3>
                    <p>{response}</p>
                  </div>
                )}
              </div>
              <Button type="submit" className="mt-4 w-full">
                Deploy Tangent
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
