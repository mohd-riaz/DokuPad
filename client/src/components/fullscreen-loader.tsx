import { LoaderIcon } from "lucide-react";

interface LoaderProps {
  label?: string;
}

function FullscreenLoader({ label }: LoaderProps) {
  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-50 flex flex-col items-center justify-center gap-2">
      <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
export default FullscreenLoader;
