"use client";

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

import { Pagination } from "tiptap-pagination-breaks";

import { useEditorStore } from "@/store/use-editor-store";

import { FontSizeExtension } from "@/extensions/font-size";
import { CustomImageResize } from "@/extensions/custom-image-resize";
import { LineHeightExtension } from "@/extensions/line-height";

import MarginRuler from "./margin-ruler";

function TextEditor({ documentId }: { documentId: string }) {
  const { setEditor } = useEditorStore();

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
        style: `padding-left: 56px; padding-right: 56px;`,
        class: `focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pb-10 cursor-text`,
      },
    },
    extensions: [
      StarterKit,
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
    ],
    content: `
    <table>
      <tbody>
        <tr>
          <th>Name</th>
          <th colspan="3">Description</th>
        </tr>
        <tr>
          <td>Cyndi Lauper</td>
          <td>Singer</td>
          <td>Songwriter</td>
          <td>Actress</td>
        </tr>
      </tbody>
    </table>
  `,
    immediatelyRender: false,
  });

  return (
    <div
      className={`size-full overflow-x-auto bg-primary-foreground px-4 print:p-0 print:bg-white print:overflow-visible text-black`}
    >
      <MarginRuler />
      <div
        className={`min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0`}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
export default TextEditor;
