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
import Link from "next/link";

type Props = {
  title: string;
  date: string;
  time: string;
  url: string;
  data: TangentData;
};
export default function Tangent({ title, date, time, url, data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [tangent, changeTangent] = useState(data);
  return (
    <>
      <Card className={`w-[350px] ${!expanded?"h-[250px]":""} transition-all duration-300`}>
        <div
          className="cursor-pointer p-4"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <CardTitle className="text-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-600 hover:underline"
            >
              {title}
            </a>
          </CardTitle>
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
                return (
                  <AccordionItem key={num} value={`${num}`}>
                    <AccordionTrigger>
                      {num + 1}
                      {". "}
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
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
