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

export interface LtabProps {
  setTab?: string[];
  setContent?: string[];
  value?: string[];
  readonly?: boolean;
  firstData?: string; // Add firstData to props
}

const DynamicCom = dynamic(() => import("./EnhancedQuillEditor"), {
  ssr: false,
});

interface ResponseData {
  id: string;
  title: string;
  content: string;
  createAt: Date;
  updatedAt: Date;
  // other properties if needed
}

const TextEditor: React.FC<LtabProps> = ({
  setTab,
  readonly = false,
  firstData = "SORE", // Set default firstData to "SORE"
}) => {
  const defaultTab = setTab && setTab.length > 0 ? setTab[0] : "SORE"; // Fallback to "SORE" if setTab is empty

  const [value, setValue] = useState<ResponseData | null>(null);
  const [activeTab, setActiveTab] = useState<string>(firstData ?? defaultTab); // Prioritize firstData or defaultTab

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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex">
      <TabsList className="flex flex-col space-y-2 w-32">
        {setTab?.map((tabValue: string, index: number) => (
          <TabsTrigger key={index} value={tabValue}>
            {tabValue}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="ml-4 w-full">
        {setTab?.map((tabValue: string) => (
          <TabsContent key={tabValue} value={tabValue}>
            <Card>
              <CardHeader>
                <CardTitle>{value?.title || "Create New Contet"}</CardTitle>
                <CardDescription>
                  {value
                    ? `Content created at: ${
                        value.createAt
                          ? value.createAt.toDateString()
                          : "Unknown date"
                      }`
                    : "Loading content..."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <DynamicCom value={value?.content || ""} readonly={readonly} />
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
