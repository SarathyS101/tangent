"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import Tangent from "@/components/Tangent";
import db from "@/utils/firestore";
import { TangentData } from "@/data/tangent";

type TangentRecord = {
  id: string;
  title: string;
  date: string;
  time: string;
  data: TangentData;
};

export default function TangentList() {
  const [tangents, setTangents] = useState<TangentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTangents() {
      try {
        const snapshot: QuerySnapshot<DocumentData> = await getDocs(
          collection(db, "tangents")
        );
        if (cancelled) return;

        const newTangents: TangentRecord[] = snapshot.docs.map((doc) => {
          const raw = doc.data() as Omit<TangentRecord, "id">;
          return {
            id: doc.id,
            title: raw.title,
            date: raw.date,
            time: raw.time,
            data: raw.data,
          };
        });

        setTangents(newTangents);
      } catch (err: any) {
        console.error("Error fetching tangents:", err);
        if (!cancelled) setError(err.message || "Failed to load tangents");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTangents();

    // cleanup in case component unmounts early
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading tangents…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (tangents.length === 0) return <p>No tangents found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {tangents.map(({id, title, date, time, data }) => (
        <Tangent  key={id} title={title} date={date} time={time} data={data} />
      ))}
    </div>
  );
}
