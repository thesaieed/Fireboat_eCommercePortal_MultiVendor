import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

function TextEditor({ textDesc, setTextDesc }) {
  const editorRef = useRef(null);

  const oninitialise = (evt, editor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      apiKey="ql6pvhv4un718nay28ae85cjkpt88yo9r1m7flexpn68ndnj"
      onInit={oninitialise}
      value={textDesc}
      onEditorChange={(e) => setTextDesc(e)}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "table",
          "code",
          "help",
          // "wordcount",
        ],

        branding: false,
        statusbar: false,
        toolbar:
          "undo redo | t " +
          "bold italic | alignleft aligncenter alignright alignjustify |" +
          "bullist numlist | outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}
export default TextEditor;
