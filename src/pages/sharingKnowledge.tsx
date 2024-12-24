"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import API from "@/lib/hooks";

const DynamicCom = dynamic(() => import("../app/components/TextEditor"), {
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
  const [dataContent, setDatacontent] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API("GET", `${process.env.NEXT_PUBLIC_API_BASE_URL}/content`);
        const data = response.data.payload;
        const titles: string[] = data.map((item: ContentItem) => item.title);
        setDatacontent(titles);
      } catch (error) {
        console.error("Error fetching content:", error);
        setDatacontent([]);
      }
    };

    fetchData(); // Call the async function directly
  }, []);


  return (
    <div className="p-0 m-0">
      <div className="pt-0 ml-40 mt-4">
        <DynamicCom
          setTab={dataContent}
          readonly={true}
          firstData={dataContent[0]}
        />
      </div>
    </div>
  );
}
