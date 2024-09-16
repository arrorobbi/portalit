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
import { useState } from "react";

export interface LtabProps {
  setTab?: string[];
  setContent?: string[];
  value?: string[];
  readonly?: boolean;
  // Add additional props if needed
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

const TextEditor: React.FC<LtabProps> = ({ setTab, readonly = false }) => {
  const [value, setValue] = useState<ResponseData | null>(null);

  const loadContent = async (title: string) => {
    const response: ResponseData = await API(
      "GET",
      `${process.env.BE_HOST}/content/${title}`
    );
    setValue(response);
  };

  console.log(value?.title);

  return (
    <Tabs defaultValue={setTab ? setTab[0] : undefined} className="flex">
      {/* TabsList should be outside the map */}
      <TabsList className="flex flex-col space-y-2 w-32">
        {setTab?.map((tabValue: string, index: number) => (
          <TabsTrigger
            onClick={() => loadContent(tabValue)}
            key={index}
            value={tabValue}
          >
            {tabValue}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Main content area */}
      <div className="ml-4 w-full">
        <TabsContent value={value?.title ?? ""}>
          <Card>
            <CardHeader>
              <CardTitle>{value?.title || "Default Title"}</CardTitle>
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
      </div>
    </Tabs>
  );
};

export default TextEditor;
