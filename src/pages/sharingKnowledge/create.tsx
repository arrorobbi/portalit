"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import API from "@/lib/hooks";
import Topbar from "@/app/components/TopBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

// Dynamically import the TextEditor component without SSR
const DynamicCom = dynamic(() => import("../../app/components/TextEditor"), {
  ssr: false,
});

interface ContentItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function CreateSharingKnowledgePage() {
  const [dataContent, setDatacontent] = useState<string[]>([]);
  const [tabCounter, setTabCounter] = useState<number>(0); // Add a counter to generate new tab titles
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {   
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API("GET", `${process.env.NEXT_PUBLIC_API_BASE_URL}/content`);
        const data = response.data.payload;
        const titles: string[] = data.map((item: ContentItem) => item.title);
        setDatacontent(titles); // Set the initial tabs
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle adding a new tab
  const handleAddNewTab = () => {
    const newTabTitle = `New Tab ${tabCounter + 1}`;
    setDatacontent((prevTabs) => [...prevTabs, newTabTitle]);
    setTabCounter((prevCounter) => prevCounter + 1);
  };

  return (
    <div className="p-10">
      <Topbar onAddNew={handleAddNewTab} /> {/* Pass the handler to Topbar */}
      <div className="pt-28">
        <DynamicCom setTab={dataContent} newTab={tabCounter} firstData={dataContent[0]}/>
      </div>
    </div>
  );
}
