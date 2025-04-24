import Link from "next/link";
import DocumentNavbar from "./DocumentNavbar";

export default function Documents() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-background">
        <DocumentNavbar />
      </div>
      <div className="mt-16">
        <Link href="/documents/1234">
          <span>bob</span>
        </Link>
      </div>
    </div>
  );
}
