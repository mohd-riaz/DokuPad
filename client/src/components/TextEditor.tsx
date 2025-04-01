"use client";
import Quill, { Delta } from "quill";
import "quill/dist/quill.snow.css";
import { DelHTMLAttributes, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

function TextEditor({ documentId }: { documentId: string }) {
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      //turn off loading ui here
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handleTextChange = (
      delta: Delta,
      oldDelta: Delta,
      source: string
    ) => {
      if (source !== "user") return;

      socket?.emit("send-changes", delta);
    };
    quill?.on("text-change", handleTextChange);
    return () => {
      quill?.off("text-change", handleTextChange);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handleTextChange = (delta: Delta) => {
      quill.updateContents(delta);
    };
    socket?.on("receive-changes", handleTextChange);
    return () => {
      socket?.off("receive-changes", handleTextChange);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper: HTMLElement | null) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    editor.style.width = "100vw";
    editor.style.minHeight = "100vh";

    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    //turn on loading ui here
    setQuill(q);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
}

export default TextEditor;
