export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin has its own nav built into the page — no portal nav wrapper needed
  return <>{children}</>;
}
