'use client'
import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value?: string;
  readonly: boolean;
  onChange?: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value = '', onChange, readonly }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        readOnly: readonly,
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['bold', 'italic', 'underline'],
              ['image'],
              ['clean'],
            ],
            handlers: {
              image: () => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();

                input.onchange = async () => {
                  if (input.files && input.files[0]) {
                    const file = input.files[0];
                    const formData = new FormData();
                    formData.append('image', file);

                    // Upload image to the public folder (or handle backend upload here)
                    const res = await fetch('/api/upload', {
                      method: 'POST',
                      body: formData,
                    });

                    const data = await res.json();
                    const imageUrl = `/uploads/${data.fileName}`;

                    // Get the current cursor position (range) in the editor
                    const range = quill.getSelection();
                    
                    // If range is null, insert image at the end of the content
                    const position = range ? range.index : quill.getLength();
                    quill.insertEmbed(position, 'image', imageUrl);
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

      quill.on('text-change', () => {
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
  }, [value, onChange]);

  return <div ref={editorRef} />;
};

export default QuillEditor;
