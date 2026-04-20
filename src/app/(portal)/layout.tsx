import PortalNav from "../../components/portal/PortalNav";
import PortalFooter from "../../components/portal/PortalFooter";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortalNav />
      <main style={{ paddingTop: "var(--nav-h)" }}>
        {children}
      </main>
      <PortalFooter />
    </>
  );
}
