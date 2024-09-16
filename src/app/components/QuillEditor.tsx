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
    // Ensure this code only runs on the client-side
    if (
      typeof window !== "undefined" &&
      editorRef.current &&
      !quillRef.current
    ) {
      const quill = new Quill(editorRef.current, {
        readOnly: readonly,
        placeholder: readonly ? "" : placeholder ?? "Write something here...", // Set placeholder text conditionally
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

                    // Upload image to the public folder (or handle backend upload here)
                    const res = await fetch(
                      "http://localhost:4021/upload/image",
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                    const data = await res.json();
                    const imageUrl = `http://localhost:4021${data.path}`;

                    // Get the current cursor position (range) in the editor
                    const range = quill.getSelection();

                    // If range is null, insert image at the end of the content
                    const position = range ? range.index : quill.getLength();
                    quill.insertEmbed(position, "image", imageUrl);

                    // Apply inline styles to the inserted image for responsiveness and resizing
                    const insertedImage = editorRef.current?.querySelector(
                      `img[src="${imageUrl}"]`
                    ) as HTMLImageElement;
                    if (insertedImage) {
                      insertedImage.style.maxWidth = "80%";
                      insertedImage.style.height = "auto";
                      insertedImage.style.cursor = "pointer";
                      insertedImage.style.resize = "both";
                      insertedImage.style.overflow = "hidden";
                    }
                  }
                };
              },
            },
          },
        },
      });

      quillRef.current = quill;

      // Set initial content based on 'value' prop
      quill.root.innerHTML = value;

      quill.on("text-change", () => {
        if (onChange) {
          onChange(quill.root.innerHTML);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (quillRef.current) {
        quillRef.current.disable();
        quillRef.current = null;
      }
    };
  }, [value, onChange, readonly]);

  return <div ref={editorRef} />;
};

export default QuillEditor;
