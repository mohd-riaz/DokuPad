import { useEditorStore } from "@/store/use-editor-store";
import { useState } from "react";

function TableInserter() {
  const { editor } = useEditorStore();

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
  };

  const [size, setSize] = useState({ rows: 1, cols: 1 });

  const cells = Array.from({ length: 10 }, () => Array.from({ length: 10 }));

  return (
    <div
      className="flex flex-col gap-1"
      onMouseLeave={() => setSize({ rows: 1, cols: 1 })}
      onClick={() => insertTable(size)}
    >
      {cells.map((_, y) => (
        <div key={y} className="flex gap-1">
          {cells[y].map((_, x) => (
            <div
              key={x}
              className={`size-4 border border-neutral-500 rounded-[2px] ${
                y < size.rows && x < size.cols && "bg-neutral-500"
              }`}
              onMouseEnter={() => setSize({ rows: y + 1, cols: x + 1 })}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
export default TableInserter;
