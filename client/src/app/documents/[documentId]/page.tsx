import Navbar from "./Navbar";
import TextEditor from "./TextEditor";
import Toolbar from "./Toolbar";

async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  return (
    <div className="min-h-screen bg-primary-foreground overflow-auto">
      <div className="flex flex-col fixed top-0 left-0 right-0 z-10 bg-primary-foreground print:hidden">
        <Navbar />
        <Toolbar />
      </div>
      <div className="pt-[122px] print:pt-0">
        <TextEditor documentId={documentId} />
      </div>
    </div>
  );
}
export default DocumentPage;
