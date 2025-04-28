import Logo from "@/components/logo";
import Link from "next/link";
import SearchInput from "./search-input";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
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
      <div className="pl-6 mr-4 flex gap-3 items-center">
        <OrganizationSwitcher
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
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
