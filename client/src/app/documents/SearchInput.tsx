"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";

export default function SearchInput() {
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.blur();
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <form className="relative max-w-[720px] w-full">
        <Input
          value={value}
          onChange={handleChange}
          ref={inputRef}
          placeholder="Search"
          className="md:text-base px-12 w-full border-none focus-visible:shadow-sm bg-secondary rounded-full h-[40px] focus-visible:ring-0 focus:bg-background focus-visible:shadow-neutral-500 transition-shadow duration-150"
        />
        <Button
          type="submit"
          variant="ghost"
          className="size-9 absolute left-1 top-1/2 -translate-y-1/2 rounded-full hover:bg-input"
        >
          <SearchIcon className="size-5" />
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            className="size-9 absolute right-1 top-1/2 -translate-y-1/2 rounded-full hover:bg-input"
            onClick={handleClear}
          >
            <XIcon className="size-5" />
          </Button>
        )}
      </form>
    </div>
  );
}
