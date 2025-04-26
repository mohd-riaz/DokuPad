import Logo from "@/components/logo";
import Link from "next/link";
import SearchInput from "./search-input";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

function DocumentNavbar() {
  const { resolvedTheme } = useTheme();
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6 ml-4">
        <Link href="/">
          <Logo />
        </Link>
        <h3 className="text-xl">DokuPad</h3>
      </div>
      <SearchInput />
      <div className="mr-4 flex items-center">
        <UserButton
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        />
      </div>
    </nav>
  );
}
export default DocumentNavbar;
