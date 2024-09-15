"use client";
import React from "react";
import QuillEditor from "./QuillEditor"; // Adjust the import path as necessary
import { Button } from "@/components/ui/button";

export interface EnhancedQuillEditorProps {
  value?: string;
  readonly?: boolean;
  onChange?: (content: string) => void;
  // Add additional props if needed
}

export default function EnhancedQuillEditor({
  value,
  onChange,
  readonly = false,
}: EnhancedQuillEditorProps) {
  return (
    <div>
      <div className="grid w-full gap-2">
        <QuillEditor value={value} onChange={onChange} readonly={readonly} />
        <Button>Save</Button>
      </div>
    </div>
  );
}
