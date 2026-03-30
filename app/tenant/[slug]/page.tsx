export default function TenantPage({ params }: { params: { slug: string } }) {
  return (
    <div style={{ padding: 40 }}>
      🚀 Welcome to {params.slug} Institute
    </div>
  );
}