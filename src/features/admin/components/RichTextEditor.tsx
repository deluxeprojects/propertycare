'use client';

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export function RichTextEditor({ value, onChange, placeholder, height = 500 }: RichTextEditorProps) {
  const editorRef = useRef<unknown>(null);
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY ?? '';

  if (!apiKey || apiKey === 'placeholder') {
    // Fallback to textarea if no API key
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Start writing...'}
        rows={Math.floor(height / 25)}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed focus:border-accent focus:outline-none"
      />
    );
  }

  return (
    <Editor
      apiKey={apiKey}
      onInit={(_evt, editor) => { editorRef.current = editor; }}
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'link image | removeformat | help',
        content_style: `
          body { font-family: 'DM Sans', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.7; color: #1a1a1a; }
          h1 { font-size: 28px; font-weight: 700; margin: 20px 0 10px; }
          h2 { font-size: 22px; font-weight: 600; margin: 18px 0 8px; }
          h3 { font-size: 18px; font-weight: 600; margin: 16px 0 6px; }
          p { margin: 0 0 12px; }
          a { color: #4ECDC4; }
          ul, ol { margin: 0 0 12px 20px; }
        `,
        placeholder: placeholder ?? 'Start writing your content...',
        branding: false,
        promotion: false,
        skin: 'oxide',
      }}
    />
  );
}
