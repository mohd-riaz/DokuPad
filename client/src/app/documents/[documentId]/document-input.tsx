import { BsCloudCheck } from "react-icons/bs";
import { Id } from "../../../../convex/_generated/dataModel";
import React, { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

function DocumentInput({ title, id }: { title: string; id: Id<"documents"> }) {
  const [value, setValue] = useState(title);

  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const mutate = useMutation(api.documents.updateById);

  const debouncedUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;
    setIsPending(true);
    mutate({ id, title: newValue })
      .then(() => toast.success("Title updated"))
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value === title) return;
    setIsPending(true);
    mutate({ id, title: value })
      .then(() => {
        toast.success("Title updated");
        setIsEditing(false);
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || ""}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 tetx-lg text-foreground px-1.5 bg-transparent truncate"
          ></input>
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}
      <BsCloudCheck />
    </div>
  );
}
export default DocumentInput;
