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
      <Navbar />
      <Toolbar />
      <TextEditor documentId={documentId} />
    </div>
  );
}
export default DocumentPage;
