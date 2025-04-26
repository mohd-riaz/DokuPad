import Logo from "@/components/logo";
import Link from "next/link";
import SearchInput from "./search-input";

function DocumentNavbar() {
  return (
    <nav className="flex items-center justify-between h-full w-full px-2">
      <div className="flex gap-3 items-center shrink-0 pr-6 ml-4">
        <Link href="/">
          <Logo />
        </Link>
        <h3 className="text-xl">DokuPad</h3>
      </div>
      <SearchInput />
      <div />
    </nav>
  );
}
export default DocumentNavbar;
