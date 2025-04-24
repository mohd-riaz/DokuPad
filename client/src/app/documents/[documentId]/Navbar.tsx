"use client";

import Link from "next/link";
import DocumentInput from "./DocumentInput";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ImageIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SearchIcon,
  StrikethroughIcon,
  Table2Icon,
  TextIcon,
  TrashIcon,
  Underline,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import Logo from "@/components/Logo";
import { useEditorStore } from "@/store/use-editor-store";
import TableInserter from "./TableInserter";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function Navbar() {
  const { editor } = useEditorStore();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

  const [rows, setRows] = useState("");
  const [cols, setCols] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl_ = URL.createObjectURL(file);
        onChange(imageUrl_);
      }
    };

    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl("");
      setIsImageDialogOpen(false);
    }
  };

  return (
    <nav
      className={` flex items-center justify-between w-screen h-fit z-10 bg-background print:hidden pt-2 text-foreground pb-1`}
    >
      <div className="flex gap-2 items-center justify-center ml-4">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex flex-col">
          <DocumentInput />

          <div className="flex">
            <Menubar
              className={`border-none bg-transparent shadow-none h-auto p-0`}
            >
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  File
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="size-4 mr-2" />
                      Save
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>
                        <FileJsonIcon className="size-4 mr-2" />
                        JSON
                      </MenubarItem>
                      <MenubarItem>
                        <GlobeIcon className="size-4 mr-2" />
                        HTML
                      </MenubarItem>
                      <MenubarItem>
                        <BsFilePdf className="size-4 mr-2" />
                        PDF
                      </MenubarItem>
                      <MenubarItem>
                        <FileTextIcon className="size-4 mr-2" />
                        Text
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem>
                    <FilePlusIcon className="size-4 mr-2" />
                    New Document
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <FilePenIcon className="size-4 mr-2" />
                    Rename
                  </MenubarItem>
                  <MenubarItem>
                    <TrashIcon className="size-4 mr-2" />
                    Remove
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 mr-2" />
                    Print <MenubarShortcut>Ctrl+P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() => editor?.chain().focus().undo().run()}
                  >
                    <Undo2Icon className="size-4 mr-2" />
                    Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => editor?.chain().focus().redo().run()}
                  >
                    <Redo2Icon className="size-4 mr-2" />
                    Redo<MenubarShortcut>Ctrl+Y</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Insert
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <ImageIcon className="size-4 mr-2" />
                      Image
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={onUpload}>
                        <UploadIcon className="size-4 mr-2" />
                        Upload
                      </MenubarItem>
                      <MenubarItem onClick={() => setIsImageDialogOpen(true)}>
                        <SearchIcon className="size-4 mr-2" />
                        Paste Image Url
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <Table2Icon className="size-4 mr-2" />
                      Table
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <TableInserter />
                      <MenubarSeparator />
                      <MenubarItem onClick={() => setIsTableDialogOpen(true)}>
                        Insert Table...
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              {/* Image dialog */}
              <Dialog
                open={isImageDialogOpen}
                onOpenChange={setIsImageDialogOpen}
              >
                <DialogContent aria-describedby="">
                  <DialogHeader>
                    <DialogTitle>Insert Image Url</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Insert Image Url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleImageUrlSubmit();
                      }
                    }}
                  />
                  <DialogFooter>
                    <Button onClick={handleImageUrlSubmit}>Insert</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Table dialog */}
              <Dialog
                open={isTableDialogOpen}
                onOpenChange={setIsTableDialogOpen}
              >
                <DialogContent aria-describedby="">
                  <DialogHeader>
                    <DialogTitle>Insert Table</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Rows"
                    value={rows}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Allow empty input (so user can delete), or only digits
                      if (input === "" || /^[0-9]+$/.test(input)) {
                        setRows(input);
                      }
                    }}
                  />
                  <Input
                    placeholder="Columns"
                    value={cols}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Allow empty input (so user can delete), or only digits
                      if (input === "" || /^[0-9]+$/.test(input)) {
                        setCols(input);
                      }
                    }}
                  />
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        editor
                          ?.chain()
                          .focus()
                          .insertTable({
                            rows: +rows || 1,
                            cols: +cols || 1,
                            withHeaderRow: false,
                          })
                          .run();
                        setIsTableDialogOpen(false);
                      }}
                    >
                      Insert
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Format
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="size-4 mr-2" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleBold().run()
                        }
                      >
                        <BoldIcon className="size-4 mr-2" />
                        Bold<MenubarShortcut>Ctrl+B</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleItalic().run()
                        }
                      >
                        <ItalicIcon className="size-4 mr-2" />
                        Italic<MenubarShortcut>Ctrl+I</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleUnderline().run()
                        }
                      >
                        <Underline className="size-4 mr-2" />
                        <span>Underline&nbsp;&nbsp;</span>
                        <MenubarShortcut>Ctrl+U</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleStrike().run()
                        }
                      >
                        <StrikethroughIcon className="size-4 mr-2" />
                        <span>Strikethrough&nbsp;&nbsp;</span>
                        <MenubarShortcut>Ctrl+S</MenubarShortcut>
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem
                    onClick={() =>
                      editor?.chain().focus().unsetAllMarks().run()
                    }
                  >
                    <RemoveFormattingIcon className="size-4 mr-2" />
                    Clear formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
