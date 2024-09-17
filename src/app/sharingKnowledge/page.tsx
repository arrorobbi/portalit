"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import API from "@/lib/hooks";
import Topbar from "../components/TopBar";

const DynamicCom = dynamic(() => import("../components/TextEditor"), {
  ssr: false,
});

interface ContentItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function SharingKnowledgePage() {
  const [dataContent, setDatacontent] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => { //data is push in props texteditor
    const fetchData = async () => {
      try {
        const response = await API("GET", `${process.env.BE_HOST}/content`);
        const data = response.data.payload;
        // const titles: string[] = data.map((item: ContentItem) => item.title);
        setDatacontent(data); // Update the state with the resolved data
      } catch (error) {
        console.error("Error fetching content:", error);
        setDatacontent([]);
      }
    };

    fetchData(); // Call the async function directly
  }, []);
  console.log(dataContent);
  

  return (
    <div className="p-10">
      <Topbar />
      <div className="pt-28">
        <DynamicCom setTab={dataContent} readonly={true} />
      </div>
    </div>
  );
}
