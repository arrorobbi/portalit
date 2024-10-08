"use client";
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value?: string;
  readonly?: boolean;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value = "",
  onChange,
  readonly,
  placeholder,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      editorRef.current &&
      !quillRef.current
    ) {
      const quill = new Quill(editorRef.current, {
        readOnly: readonly,
        placeholder: readonly ? "" : placeholder ?? "Write something here...",
        theme: "snow",
        modules: {
          toolbar: !readonly && {
            container: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ size: ["small", "medium", "large", "huge"] }],
              ["bold", "italic", "underline"],
              ["image"],
              ["clean"],
            ],
            handlers: {
              image: () => {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.click();

                input.onchange = async () => {
                  if (input.files && input.files[0]) {
                    const file = input.files[0];
                    const formData = new FormData();
                    formData.append("image", file);

                    const res = await fetch(
                      `${process.env.BE_HOST}/upload/image`,
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                    const data = await res.json();
                    const imageUrl = `${process.env.BE_HOST}${data.path}`;
                    const range = quill.getSelection();
                    const position = range ? range.index : quill.getLength();
                    quill.insertEmbed(position, "image", imageUrl);

                    const insertedImage = editorRef.current?.querySelector(
                      `img[src="${imageUrl}"]`
                    ) as HTMLImageElement;
                    if (insertedImage) {
                      // Check if the image is portrait by comparing width and height
                      if (insertedImage.naturalHeight > insertedImage.naturalWidth) {
                        // Apply portrait-specific styles
                        insertedImage.style.maxWidth = "30%"; // Smaller width for portrait
                        insertedImage.style.height = "auto"; // Maintain aspect ratio
                      } else {
                        // Apply landscape-specific styles (if needed)
                        insertedImage.style.maxWidth = "30%"; // Full width for landscape
                        insertedImage.style.height = "auto"; // Maintain aspect ratio
                      }
                    
                      // Common styles
                      insertedImage.style.cursor = "pointer";
                      insertedImage.style.resize = "both"; // Enable resizing
                      insertedImage.style.overflow = "hidden"; // Prevent overflow
                    }
                  }
                };
              },
            },
          },
        },
      });

      quillRef.current = quill;
      quill.root.innerHTML = value;

      quill.on("text-change", () => {
        if (onChange) {
          onChange(quill.root.innerHTML);
        }
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.disable();
        quillRef.current = null;
      }
    };
  }, []); // <-- Only initialize Quill once

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return <div ref={editorRef} />;
};

export default QuillEditor;
