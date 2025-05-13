import { create } from "zustand";

import { type Editor } from "@tiptap/react";

interface EditorState {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  isPending: boolean;
  setIsPending: (isPending: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  editor: null,
  setEditor: (editor) => set((state) => ({ ...state, editor })),
  isPending: false,
  setIsPending: (isPending) => set((state) => ({ ...state, isPending })),
}));
