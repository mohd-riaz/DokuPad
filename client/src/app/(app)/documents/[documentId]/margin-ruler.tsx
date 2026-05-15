import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";

const markers = Array.from({ length: 83 }, (_, i) => i);

export default function MarginRuler({
  left,
  right,
  documentId,
  leftMargin,
  setLeftMargin,
  rightMargin,
  setRightMargin,
}: {
  left: number;
  right: number;
  documentId: string;
  leftMargin: number;
  setLeftMargin: (margin: number) => void;
  rightMargin: number;
  setRightMargin: (margin: number) => void;
}) {
  const { setIsPending } = useEditorStore();

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const leftUpdate = useMutation(api.documents.updateLeftMargin);
  const rightUpdate = useMutation(api.documents.updateRightMargin);

  useEffect(() => {
    setLeftMargin(left);
  }, [left, setLeftMargin]);

  useEffect(() => {
    setRightMargin(right);
  }, [right, setRightMargin]);

  const leftDebouncedUpdate = useDebounce((newValue: number) => {
    if (newValue === left) return;
    setIsPending(true);
    leftUpdate({ id: documentId as Id<"documents">, leftMargin: newValue })
      .then(() => console.log("Left margin updated"))
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  });

  const rightDebouncedUpdate = useDebounce((newValue: number) => {
    if (newValue === right) return;
    setIsPending(true);
    rightUpdate({ id: documentId as Id<"documents">, rightMargin: newValue })
      .then(() => console.log("Right margin updated"))
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  });

  const rulerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => {
    setIsDraggingLeft(true);
  };

  const handleRightMouseDown = () => {
    setIsDraggingRight(true);
  };

  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  };

  const handleLeftDoubleClick = () => {
    setLeftMargin(56);
    leftDebouncedUpdate(56);
  };

  const handleRightDoubleClick = () => {
    setRightMargin(56);
    rightDebouncedUpdate(56);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
        const container = rulerRef.current.querySelector("#ruler-container");
        const buffer = 100;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const relativeX = e.clientX - containerRect.left;
          const rawPosition = Math.max(0, Math.min(816, relativeX));

          if (isDraggingLeft) {
            const maxLeftPosition = 816 - rightMargin - buffer;
            const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
            setLeftMargin(newLeftPosition);
            leftDebouncedUpdate(newLeftPosition);
          } else if (isDraggingRight) {
            const maxRightPosition = 816 - (leftMargin + buffer);
            const newRightPosition = Math.max(816 - rawPosition, 0);
            const constrainedRightPosition = Math.min(
              newRightPosition,
              maxRightPosition
            );
            setRightMargin(constrainedRightPosition);
            rightDebouncedUpdate(constrainedRightPosition);
          }
        }
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingLeft, isDraggingRight]);

  return (
    <div
      ref={rulerRef}
      className="w-[816px] mx-auto h-6 border-b border-neutral-400 flex items-end relative select-none print:hidden"
    >
      <div id="ruler-container" className="w-full h-full relative">
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onMouseDown={handleLeftMouseDown}
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />
        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]">
            {markers.map((marker) => {
              const position = (marker * 816) / 82;
              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {marker % 10 === 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}
                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                    </>
                  )}
                  {marker % 5 !== 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-foreground tranform -translate-x-1/2" />
      <div
        className={cn(
          "absolute left-1/2 top-4 transform -translate-x-1/2 transition-opacity duration-150 h-screen w-[1px] bg-neutral-500",
          isDragging ? "block" : "hidden"
        )}
      />
    </div>
  );
};
