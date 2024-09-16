"use client";

import dynamic from "next/dynamic";
import Topbar from "../../components/TopBar";
import { useEffect, useState } from "react";
import API from "@/lib/hooks";

// Dynamically import the TextEditor component without SSR
const DynamicCom = dynamic(() => import("../../components/TextEditor"), {
  ssr: false,
});

interface ContentItem {
  id: string;
  title: string;
  content: string;
  createdAt: string; // Ensure this matches API response format
  updatedAt: string; // Ensure this matches API response format
}

export default function CreateSharingKnowledgePage() {
  const [dataContent, setDatacontent] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API("GET", `${process.env.BE_HOST}/content`);
        const data = response.data.payload;
        const titles: string[] = data.map((item: ContentItem) => item.title);
        setDatacontent(titles);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-10">
      <Topbar />
      <div className="pt-28">
        <DynamicCom setTab={dataContent} />
      </div>
    </div>
  );
}
