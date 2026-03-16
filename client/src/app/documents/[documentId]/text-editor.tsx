"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import TiptapImage from "@tiptap/extension-image";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TiptapLink from "@tiptap/extension-link";

import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { SocketIOProvider } from "y-socket.io";
import * as awarenessProtocol from "y-protocols/awareness.js";

// import { Pagination } from "tiptap-pagination-breaks";

import { useEditorStore } from "@/store/use-editor-store";

import { FontSizeExtension } from "@/extensions/font-size";
import { CustomImageResize } from "@/extensions/custom-image-resize";
import { LineHeightExtension } from "@/extensions/line-height";

import MarginRuler from "./margin-ruler";
import FullscreenLoader from "@/components/fullscreen-loader";
import { useDebounce } from "@/hooks/use-debounce";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

function TextEditor({
  documentId,
  token,
  isCollaborative = true,
  content,
  leftMargin = 56,
  rightMargin = 56,
}: {
  documentId: string;
  token: string | undefined;
  isCollaborative?: boolean;
  content: ArrayBuffer;
  leftMargin?: number;
  rightMargin?: number;
}) {
  const { setEditor, setIsPending } = useEditorStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [leftMargin_, setLeftMargin] = useState(leftMargin);
  const [rightMargin_, setRightMargin] = useState(rightMargin);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ydoc = useMemo(() => new Y.Doc(), [documentId]);

  const { user } = useUser();

  const hue =
    Math.abs(
      user?.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
    ) % 360;
  const color = `hsl(${hue}, 80%, 60%)`;

  const provider = useMemo(() => {
    if (!isCollaborative) {
      return null;
    }
    const configuration = {
      // Enable/Disable garbage collection (by default the garbage collection is enabled)
      gcEnabled: true,
      // Enable/Disable auto connect when the instance is created (by default the auto connection is enabled). Set this to "false" if you want to connect manually using provider.connect()
      autoConnect: true,
      // Specify an existing Awareness instance - see https://github.com/yjs/y-protocols
      awareness: new awarenessProtocol.Awareness(ydoc),
      // Specify a number of milliseconds greater than 0 to resynchronize the document (by default is -1)
      resyncInterval: -1,
      // Disable broadcast channel synchronization (by default the broadcast channel synchronization is enabled)
      disableBc: false,
      // Specify the authentication data to send to the server on handshake
      auth: { token: token, documentId }, // Example: { token: 'valid-token' }
    };
    return new SocketIOProvider(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL!,
      documentId,
      ydoc,
      configuration,
    );

  }, [documentId, token, isCollaborative, ydoc]);

  //-----------------add personal document functions here----------------
  //load personal document from database
  useEffect(() => {
    if (isCollaborative) {
      return;
    }
    const updateUint8 = new Uint8Array(content);
    if (updateUint8.length > 0) {
      Y.applyUpdate(ydoc, updateUint8);
    }
    setIsLoaded(true);
  }, [isCollaborative, content, ydoc]);

  const mutate = useMutation(api.documents.saveDocumentByIdClient);

  const autoDebouncedUpdate = useDebounce(() => {
    const update = Y.encodeStateAsUpdate(ydoc);
    setIsPending(true);
    mutate({
      id: documentId as Id<"documents">,
      initialContent: update.buffer as ArrayBuffer,
    })
      .then(() => console.log("Document saved."))
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  }, 5000);

  
  const manualDebouncedUpdate = useDebounce(() => {
    const update = Y.encodeStateAsUpdate(ydoc);
    setIsPending(true);
    mutate({
      id: documentId as Id<"documents">,
      initialContent: update.buffer as ArrayBuffer,
    })
    .then(() => console.log("Document saved."))
    .catch(() => toast.error("Something went wrong"))
    .finally(() => setIsPending(false));
  });
  
  useEffect(() => {
    if (!isCollaborative) {
      ydoc.on("update", autoDebouncedUpdate);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // (event.ctrlKey) -> Windows/Linux
      // (event.metaKey) -> macOS Command key
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); 
        manualDebouncedUpdate()
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (!isCollaborative) {
        ydoc.off("update", autoDebouncedUpdate);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ydoc, isCollaborative, autoDebouncedUpdate, manualDebouncedUpdate]);

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin_}px; padding-right: ${rightMargin_}px;`,
        class: `focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pb-10 cursor-text`,
      },
    },
    extensions: [
      StarterKit.configure({ history: false }),
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
      }),
      FontSizeExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskItem.configure({ nested: true }),
      TaskList,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TiptapImage.configure({ inline: true }),
      CustomImageResize,
      Underline,
      FontFamily,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      // Pagination.configure({
      //   pageHeight: 1056, // default height of the page
      //   pageWidth: 816, // default width of the page
      //   pageMargin: 0, // default margin of the page
      // }),
      TiptapLink.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
      Collaboration.configure({ document: ydoc }),
      ...(isCollaborative
        ? [
            CollaborationCursor.configure({
              provider,
              user: {
                name:
                  user?.fullName ||
                  user?.firstName ||
                  user?.lastName ||
                  user?.emailAddresses[0].emailAddress ||
                  "Anonymous",
                color,
              },
            }),
          ]
        : []),
    ],
    content: "",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!provider || !editor) return;

    const handleSync = async (isSynced: boolean) => {
      setTimeout(() => {
        setIsLoaded(isSynced);
      }, 500);
    };

    const handleUnload = () => {
      editor.commands.blur();
      provider.awareness.setLocalState(null); // cleanup awareness state
    };

    provider.on("sync", handleSync);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      provider.off("sync", handleSync);
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload(); // cleanup on component unmount too
    };
  }, [provider, editor]);

  return isLoaded ? (
    <div
      className={`size-full overflow-x-auto bg-primary-foreground px-4 print:p-0 print:bg-white print:overflow-visible text-black`}
    >
      <MarginRuler
        left={leftMargin}
        right={rightMargin}
        documentId={documentId}
        leftMargin={leftMargin_}
        setLeftMargin={setLeftMargin}
        rightMargin={rightMargin_}
        setRightMargin={setRightMargin}
      />
      <div
        className={`min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0`}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  ) : (
    <FullscreenLoader label="Loading document..." />
  );
}
export default TextEditor;
