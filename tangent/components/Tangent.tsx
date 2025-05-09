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
import { StringToBoolean } from "class-variance-authority/types";

type Props = {
  title: string;
  date: string;
  time: string;
  data: TangentData;
};
export default function Tangent({title, date, time, data}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [tangent, changeTangent] = useState(data);
  return (
    <>
      <Card className="w-[350px] transition-all duration-300">
        <div
          className="cursor-pointer p-4"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {date} @ {time}
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
