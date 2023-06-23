import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [false, 2, 3, false] }],
    [{ font: [] }],
    [{ align: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ script: "sub" }, { script: "super" }],
    ["link", "code"],
    ["clean"],
  ],
};

// const formats = [
//   "header",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "code",
//   "clean",
// ];

function TextEditor({ textDesc, setTextDesc }) {
  return (
    <ReactQuill
      placeholder="Product Description"
      theme="snow"
      defaultValue={textDesc}
      value={textDesc}
      onChange={setTextDesc}
      // formats={formats}
      modules={modules}
    />
  );
}

export default TextEditor;
