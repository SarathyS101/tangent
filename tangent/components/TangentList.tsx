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
import auth from "@/utils/authorization";
import { query, where } from "firebase/firestore";
import { TangentData } from "@/data/tangent";
import AddTangent from "@/components/AddTangent";

type TangentRecord = {
  id: string;
  title: string;
  date: string;
  time: string;
  url: string;
  data: TangentData;
};

export default function TangentList() {
  const [tangents, setTangents] = useState<TangentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployed, setDeployed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;

    async function fetchTangents() {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("Not signed in");
        setUid(uid);
        // build a query: only docs where userId == current user
        const q = query(collection(db, "tangents"), where("userId", "==", uid));

        const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
        if (cancelled) return;

        const myTangents = snapshot.docs.map((doc) => {
          const raw = doc.data() as Omit<TangentRecord, "id">;
          return {
            id: doc.id,
            title: raw.title,
            date: raw.date,
            time: raw.time,
            url: raw.url,
            data: raw.data,
          };
        });

        setTangents(myTangents);
      } catch (err: any) {
        console.error("Error fetching tangents:", err);
        if (!cancelled) setError(err.message || "Failed to load tangents");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTangents();
    setDeployed(false);
    // cleanup in case component unmounts early
    return () => {
      cancelled = true;
    };
  }, [deployed]);

  if (loading) return <p>Loading tangents…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  //   if (tangents.length === 0) return <p>No tangents found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start items-center justify-items-center">
      {uid!=null && <AddTangent id={uid} deployed={deployed} setDeployed={setDeployed} />}
      {tangents.map(({ id, title, date, time, url, data }) => (
        <Tangent key={id} url ={url} title={title} date={date} time={time} data={data} />
      ))}
    </div>
  );
}
