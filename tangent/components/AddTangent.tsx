"use client";
import { useState } from "react";
import db from "@/utils/firestore";
import { collection, addDoc } from "@firebase/firestore";
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
            <form>
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
                  <Input id="pdf" type="file" accept=".pdf" />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
