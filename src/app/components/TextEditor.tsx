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
// import { Separator } from "@/components/ui/separator";

export interface LtabProps {
  setTab?: string[]; // Adjusted type definition
  setContent?: string[];
  value?: string[];
  readonly?: boolean;
  firstData?: string;
  newTab?: number;
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
  // other properties if needed
}

const TextEditor: React.FC<LtabProps> = ({
  setTab,
  readonly = false, // Set default firstData to "SORE"
  firstData, // Added firstData to props
  newTab,
}) => {
  //const defaultTab = setTab && setTab.length > 0 ? setTab[0] : "SORE"; // Fallback to "SORE" if setTab is empty
  const [value, setValue] = useState<ResponseData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  // console.log result is "Authenticator"
  console.log(firstData); // get key from components for req content/:id

  useEffect(() => {
    // Check if newTab exists, and if it does, update activeTab
    if (firstData) {
      setActiveTab(firstData);
    }
  }, [firstData]); // Re-run this effect when newTab changes

  const localDate = value?.createdAt ? new Date(value.createdAt) : null;
  const formattedLocalDate = localDate
    ? localDate.toLocaleString()
    : "Unknown date";

  useEffect(() => {
    // Check if newTab exists, and if it does, update activeTab
    if (newTab) {
      setActiveTab(`New Tab ${newTab}`);
      setValue(null);
    }
  }, [newTab]); // Re-run this effect when newTab changes

  useEffect(() => {
    if (activeTab) {
      loadContent(activeTab); // Load content based on the active tab
    }
  }, [activeTab]);

  const loadContent = async (title: string) => {
    try {
      const response: ResponseData = await API(
        "GET",
        `${process.env.BE_HOST}/content/${title}`
      );
      setValue(response);
    } catch (error) {
      console.error("Error loading content:", error);
    }
  };


  console.log(value);
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex">
      <ScrollArea className="sticky top-0 h-72 w-48 rounded-md border overflow-y-auto">
        <TabsList className="flex flex-col items-center justify-center h-full p-6 space-y-4 bg-gray-100 rounded-lg pl-10">
          {setTab?.map((tabValue: string, index: number) => (
            <TabsTrigger
              key={index}
              value={tabValue}
              className={`w-full p-2 text-center rounded-lg transition-colors duration-300 ${
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
                <DynamicCom value={value?.content || ""} readonly={readonly} id={value?.id}/>
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
