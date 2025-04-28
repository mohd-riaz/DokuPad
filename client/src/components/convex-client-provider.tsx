"use client";

import { ReactNode } from "react";
import {
  ConvexReactClient,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import FullscreenLoader from "./fullscreen-loader";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <Unauthenticated>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <SignIn
              appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
              }}
            />
          </div>
        </Unauthenticated>
        <AuthLoading>
          <FullscreenLoader label="Please wait..." />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
