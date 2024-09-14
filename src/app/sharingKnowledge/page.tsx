"use client";
import React from "react";
import QuillEditor from "../components/QuillEditor"; // Adjust the import path as necessary

interface EnhancedQuillEditorProps {
  value?: string;
  readonly?: boolean;
  onChange?: (content: string) => void;
  // Add additional props if needed
}

const EnhancedQuillEditor: React.FC<EnhancedQuillEditorProps> = ({
  value,
  onChange,
  readonly = false,
}) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        margin: "20px",
      }}
    >
      <h2>Custom Quill Editor</h2>
      <QuillEditor value={value} onChange={onChange} readonly={readonly} />
    </div>
  );
};

export default EnhancedQuillEditor;
