'use client'

import { ThemeSwitcher } from "@/components/theme-switcher";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { resolvedTheme, theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ThemeSwitcher
        value={theme || "system"}
        onChange={(theme) => {
          setTheme(theme);
        }}
        className="absolute right-4 top-4"
      />
      <SignIn
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
}
