"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import API from "@/lib/hooks";
import Topbar from "../components/TopBar";
import { LtabProps } from "../components/TextEditor";

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

const SharingKnowledgePage: React.FC<LtabProps> = ({ value = [] }) => {
  const [dataContent, setDatacontent] = useState<string[]>(value);

  // cant fetch content but API func is works
  useEffect(() => {
    const fetchData = async () => {
      try {
        const content = await API("GET", `${process.env.BE_HOST}/content`);
        const data = content.data.payload;
        const title: string[] = [];

        data.map((value: ContentItem) => title.push(value.title));
        return title;
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    const loadData = async () => {
      const res: string[] = (await fetchData()) || []; // Ensure res is never undefined
      setDatacontent(res); // Update the state with the resolved data
    };

    loadData(); // Call the async wrapper
  }, []);

  return (
    <div className="p-10">
      <Topbar />
      <div className="pt-28">
        <DynamicCom setTab={dataContent} readonly />
      </div>
    </div>
  );
};

export default SharingKnowledgePage;
