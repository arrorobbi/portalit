import React, { useState } from "react";
import QuillEditor from "./QuillEditor"; // Adjust the import path as necessary
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import API from "@/lib/hooks";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export interface EnhancedQuillEditorProps {
  value?: string;
  readonly?: boolean;
  title?: string;
  onChange?: (content: string) => void;
  setTab?: string[];
  id?: string
  // Add additional props if needed
}

export default function EnhancedQuillEditor({
  value = "",
  readonly = false,
  title = "",
  id
}: EnhancedQuillEditorProps) {
  // State to hold the editor content
  const [editorContent, setEditorContent] = useState<string>(value);
  const [contentTitle, setTitle] = useState<string>(title);

  // Handle the input change
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value); // Update the state with the input value
  };

  const postHandler = async (id:string | undefined) => {
    if(id === undefined){
      const payload = { title: contentTitle, content: editorContent };
      const response = await API(
        "POST",
        `${process.env.BE_HOST}/content`,
        payload
      );
      if (response.status === 200) {
        // Success!
        // Redirect to the newly created content page
        window.location.href = `/sharingKnowledge/create`;
      } else {
        // Handle error
        console.error("Error creating content:", response.error);
      }
    } else {
      
    }
  };
  return (
    <div>
      <div className="grid w-full gap-2">
        {!readonly ? (
          <>
            <Label className="pl-4 font-bold italic text-xl">Title</Label>
            <Input
              placeholder="Input Title"
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
          <div className="min-h-screen h-full max-h-screen overflow-auto">
            <ScrollArea className="h-full overflow-auto">
              <QuillEditor
                value={value}
                onChange={setEditorContent}
                readonly={readonly}
              />
            </ScrollArea>
          </div>
        )}

        {!readonly && <Button onClick={() => postHandler(id)}>Save</Button>}
      </div>
    </div>
  );
}
