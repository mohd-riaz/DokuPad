"use client";

import { ReactNode } from "react";
import {
  ConvexReactClient,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import FullscreenLoader from "./fullscreen-loader";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>{children}</Unauthenticated>
      <AuthLoading>
        <FullscreenLoader label="Please wait..." />
      </AuthLoading>
    </ConvexProviderWithClerk>
  );
}
