"use client";
import React, { useState } from "react";
import QuillEditor from "./QuillEditor"; // Adjust the import path as necessary
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface EnhancedQuillEditorProps {
  value?: string;
  readonly?: boolean;
  title?: string;
  onChange?: (content: string) => void;
  // Add additional props if needed
}

export default function EnhancedQuillEditor({
  value = "",
  readonly = false,
  title = "",
}: EnhancedQuillEditorProps) {
  // State to hold the editor content
  const [editorContent, setEditorContent] = useState<string>(value);
  const [contentTitle, setTitle] = useState<string>(title);

  // Handle the input change
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value); // Update the state with the input value
  };

  console.log(editorContent);
  // console.log(contentTitle);
  // console.log(title);

  return (
    <div>
      <div className="grid w-full gap-2">
        <Label className="pl-4 font-bold italic text-xl">Title</Label>
        <Input
          placeholder="Input Title"
          onChange={handleTitleChange}
          type="text"
          value={contentTitle}
        />
        <QuillEditor
          value={value}
          onChange={setEditorContent}
          readonly={readonly}
        />
        {!readonly && <Button>Save</Button>}
      </div>
    </div>
  );
}
