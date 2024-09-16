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
  createdAt: string;
  updatedAt: string;
}

interface SharingKnowledgePageProps {
  value?: string[];
}

export default function SharingKnowledgePage({
  value = [],
}: SharingKnowledgePageProps) {
  const [dataContent, setDatacontent] = useState<string[]>(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const content = await API("GET", `${process.env.BE_HOST}/content`);
        const data = content.data.payload;
        const titles: string[] = data.map((item: ContentItem) => item.title);
        return titles;
      } catch (error) {
        console.error("Error fetching content:", error);
        return [];
      }
    };

    const loadData = async () => {
      const res: string[] = await fetchData();
      setDatacontent(res);
    };

    loadData();
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
