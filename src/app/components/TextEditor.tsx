"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import API from "@/lib/hooks";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface LtabProps {
  setTab?: string[];
  setContent?: string[];
  value?: string[];
  readonly?: boolean;
  firstData?: string;
  newTab?: number;
  title?: string;
}

const DynamicCom = dynamic(() => import("./EnhancedQuillEditor"), {
  ssr: false,
});

interface ResponseData {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const TextEditor: React.FC<LtabProps> = ({
  setTab,
  readonly = false,
  firstData,
  newTab,
}) => {
  const [value, setValue] = useState<ResponseData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // State untuk pencarian

  console.log(firstData);

  useEffect(() => {
    if (firstData) {
      setActiveTab(firstData);
    }
  }, [firstData]);

  const localDate = value?.createdAt ? new Date(value.createdAt) : null;
  const formattedLocalDate = localDate
    ? localDate.toLocaleString()
    : "Unknown date";

  useEffect(() => {
    if (newTab) {
      setActiveTab(`New Tab ${newTab}`);
      setValue(null);
    }
  }, [newTab]);

  useEffect(() => {
    if (activeTab) {
      loadContent(activeTab);
    }
  }, [activeTab]);

  const loadContent = async (title: string) => {
    try {
      const response = await API(
        "GET",
        `${process.env.BE_HOST}/content/${title}`
      );
      setValue(response.data);
    } catch (error) {
      console.error("Error loading content:", error);
    }
  };

  // Filter tab berdasarkan nilai pencarian
  const filteredTabs = setTab?.filter((tabValue) =>
    tabValue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex">
      {/* Input pencarian */}
      <div className="w-48">
        <input
          type="text"
          placeholder="Search..."
          className="mt-2 p-2 border rounded-md w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ScrollArea className="mt-4 h-72 w-48 rounded-md border overflow-y-auto">
          <TabsList className="flex flex-col items-center justify-center h-full p-6 space-y-4 bg-gray-100 rounded-lg pl-10">
            {filteredTabs?.map((tabValue: string, index: number) => (
              <TabsTrigger
                key={index}
                value={tabValue}
                className={`w-full p-2 text-center rounded-lg transition-colors duration-300 break-words whitespace-normal ${
                  activeTab === tabValue
                    ? "bg-gray-300 text-black"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tabValue}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>

      <div className="ml-4 w-3/4">
        {setTab?.map((tabValue: string) => (
          <TabsContent key={tabValue} value={tabValue}>
            <Card>
              <CardHeader>
                <CardTitle>{value?.title || "Create New Content"}</CardTitle>
                <CardDescription>
                  {value
                    ? `created at: ${
                        value.createdAt ? formattedLocalDate : "Unknown date"
                      }`
                    : "Loading content..."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
              <p className="font-sans text-xs opacity-75">Click Zoom ( - / + ) or Ctrl + Scroll on Mouse For Zooming</p>
              <p className="font-sans text-xs opacity-75">Click on Image to OPEN The Image</p>
                <DynamicCom
                  value={value?.content || ""}
                  readonly={readonly}
                  id={value?.id}
                  title={value?.title}
                />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default TextEditor;
