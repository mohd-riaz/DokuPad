import SingleDocument from "./SingleDocument";

async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  return (
    <div>
      <SingleDocument documentId={documentId} />
    </div>
  );
}
export default DocumentPage;
