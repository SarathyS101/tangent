"use client";
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TangentData } from "@/data/tangent";
export default function Tangent() {
  const example: TangentData = {
    title: "Zheng Ha's Missionsafasdfasdfasdfas d fasdf asdfas df asdfasdf asd fasdf  asdf asdf  asdf",
    date: "2025-04-17",
    time: 1232222,
    description: "The origin of the legend.",
    tangent: [
      { title: "Why though?", content: "Still a mystery." },
      { title: "Any updates?", content: "None at this time." },
    ],
  };
  const [expanded, setExpanded] = useState(false);
  const [tangent, changeTangent] = useState<TangentData>(example);
  const time = new Date(example.time * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <>
      <Card className="w-[350px] transition-all duration-300">
        <div
          className="cursor-pointer p-4"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <CardTitle className="text-center">{tangent.title}</CardTitle>
          <CardDescription className="text-center">
            {tangent.date} @ {time}
          </CardDescription>
          <CardDescription className="text-center">
            {tangent.description}
          </CardDescription>
        </div>

        {expanded && (
          <CardContent>
            <Accordion type="multiple">
              {tangent.tangent.map((item, num) => {
                return(
                  <AccordionItem key={num} value={`${num}`}>
                    <AccordionTrigger>{num+1}{". "}{item.title}</AccordionTrigger>
                    <AccordionContent>
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        )}
      </Card>
    </>
  );
}
