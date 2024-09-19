import React, { useEffect, useState, useRef } from "react";
import QuillEditor from "./QuillEditor"; // Adjust the import path as necessary
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import API from "@/lib/hooks";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FaPlus, FaMinus } from "react-icons/fa";
import ImageModal from "./ImageModal"; // Import the modal component

interface EnhancedQuillEditorProps {
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
  const [scale, setScale] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>("");

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (title) {
      setTitle(title);
    }
  }, [title]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleImageClick = (event: Event) => {
    const target = event.target as HTMLImageElement;
    if (target.tagName === "IMG") {
      setModalImageSrc(target.src);
      setModalOpen(true);
    }
  };

  const post = async () => {
    const payload = { title: contentTitle, content: editorContent };
    const response = await API(
      "POST",
      `${process.env.BE_HOST}/content`,
      payload
    );
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
      const response = await API(
        "DELETE",
        `${process.env.BE_HOST}/content/delid/${id}`
      );
      response === undefined ? await post() : console.log("Data Not Found");
    }
  };

  useEffect(() => {
    const editorContainer = document.querySelector(".ql-editor");
    if (editorContainer) {
      editorContainer.addEventListener("click", handleImageClick);
    }

    return () => {
      if (editorContainer) {
        editorContainer.removeEventListener("click", handleImageClick);
      }
    };
  }, []);
  return (
    <div>
      <div className="grid w-full h-full gap-2">
        {!readonly ? (
          <>
            <Label className="pl-4 font-bold italic text-xl">Title</Label>
            <Input
              onChange={handleTitleChange}
              type="text"
              value={contentTitle}
            />
          </>
        ) : null}
        {!readonly ? (
          <QuillEditor
            value={value}
            onChange={setEditorContent}
            readonly={readonly}
          />
        ) : (
          <>
            <div className="mt-12 mr-40 absolute top-2 right-2 flex flex-row space-x-2">
              <button
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={() =>
                  setScale((prevScale) => Math.max(prevScale - 0.1, 0.5))
                }
                aria-label="Zoom Out"
              >
                <FaMinus className="text-sm" />
              </button>
              <button
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={() =>
                  setScale((prevScale) => Math.min(prevScale + 0.1, 2))
                }
                aria-label="Zoom In"
              >
                <FaPlus className="text-sm" />
              </button>
            </div>
            <ScrollArea className="h-80 overflow-auto" ref={scrollAreaRef}>
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "0 0",
                  transition: "transform 0.1s ease-out",
                }}
              >
                <QuillEditor
                  value={value}
                  onChange={setEditorContent}
                  readonly={readonly}
                />
              </div>
            </ScrollArea>
          </>
        )}

        {!readonly && <Button onClick={() => postHandler(id)}>Save</Button>}

        {/* Image Modal */}
        <ImageModal
          isOpen={modalOpen}
          imageSrc={modalImageSrc}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
}
