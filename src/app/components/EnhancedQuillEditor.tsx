import React, { useEffect, useState, useRef } from "react";
import QuillEditor from "./QuillEditor"; // Adjust the import path as necessary
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import API from "@/lib/hooks";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FaPlus, FaMinus } from "react-icons/fa"; // Import icons for + and -

export interface EnhancedQuillEditorProps {
  value?: string;
  readonly?: boolean;
  title?: string;
  onChange?: (content: string) => void;
  setTab?: string[];
  id?: string;
}

export default function EnhancedQuillEditor({
  value = "",
  readonly = false,
  title,
  id,
}: EnhancedQuillEditorProps) {
  const [editorContent, setEditorContent] = useState<string>(value);
  const [contentTitle, setTitle] = useState<string>("");

  const [scale, setScale] = useState<number>(1); // State to handle zoom scale
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    if (title) {
      setTitle(title);
    }
  }, [title]);

  const post = async () => {
    const payload = { title: contentTitle, content: editorContent };
    const response = await API("POST", `${process.env.BE_HOST}/content`, payload);
    if (response.status === 200) {
      window.location.href = `/sharingKnowledge/create`;
    } else {
      console.error("Error creating content:", response.error);
    }
  };

  const postHandler = async (id: string | undefined) => {
    if (id === undefined) {
      await post();
    } else {
      const response = await API("DELETE", `${process.env.BE_HOST}/content/delid/${id}`);
      response === undefined ? await post() : console.log("Data Not Found");
    }
  };

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        setScale((prevScale) => Math.max(0.5, Math.min(prevScale - event.deltaY * 0.001, 2))); // Zoom range between 0.5x to 2x
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // Functions to handle manual zoom in and zoom out
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2)); // Max zoom in to 2x
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Min zoom out to 0.5x
  };

  return (
    <div>
      <div className="grid w-full h-80 gap-2">
        {!readonly ? (
          <>
            <Label className="pl-4 font-bold italic text-xl">Title</Label>
            <Input onChange={handleTitleChange} type="text" value={contentTitle} />
          </>
        ) : null}
        {!readonly ? (
          <QuillEditor value={value} onChange={setEditorContent} readonly={readonly} />
        ) : (
          <>
          <div className="mt-12 mr-40 absolute top-2 right-2 flex flex-row space-x-2">
  <button
    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105"
    onClick={handleZoomOut}
    aria-label="Zoom Out"
  >
    <FaMinus className="text-sm" />
  </button>
  <button
    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105"
    onClick={handleZoomIn}
    aria-label="Zoom In"
  >
    <FaPlus className="text-sm" />
  </button>
</div>
            {/* <div className="min-h-screen h-auto max-h-screen overflow-auto relative">             */}
            <ScrollArea className="h-80 overflow-auto" ref={scrollAreaRef}>
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "0 0", // Ensures zooming starts from the top-left corner
                  transition: "transform 0.1s ease-out", // Smooth zoom transition
                }}
              >
                <QuillEditor value={value} onChange={setEditorContent} readonly={readonly} />
              </div>
            </ScrollArea>
          {/* </div> */}
          </>
         
        )}

        {!readonly && <Button onClick={() => postHandler(id)}>Save</Button>}
      </div>
    </div>
  );
}
