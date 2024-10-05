"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import API from "@/lib/hooks";
import io from "socket.io-client";

const socket = io("http://localhost:4021"); // Replace with your backend URL

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
        setDatacontent([]);
      }
    };

    fetchData(); // Call the async function directly
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
    });

    socket.on("newData", (newData) => {
      console.log("New data received:", newData);

      // Check if newData is valid and has a title
      if (newData && newData.title) {
        setDatacontent((prevData) => [newData.title, ...prevData]); // Prepend new title to existing titles
      }
    });

    return () => {
      socket.off("newData"); // Clean up when the component unmounts
    };
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
