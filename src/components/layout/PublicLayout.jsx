import { Outlet } from "react-router";
import PublicHeader from "./PublicHeader.jsx";
import PublicFooter from "./PublicFooter.jsx";

// Shared shell for every public marketing page (Home, About, Services,
// Contact, ...) so the header/nav and footer never drift out of sync
// between pages.
export default function PublicLayout() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F0F9FF] flex flex-col overflow-x-hidden">
      {/* Soft, decorative color blobs sitting behind every public page. They
          don't hold any data or logic - they just give the glass/blur cards
          something colorful to blur, which is what makes "glassmorphism"
          actually visible instead of just looking like a plain white card. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#0EA5E9]/20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[28rem] h-[28rem] rounded-full bg-[#22C55E]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[24rem] h-[24rem] rounded-full bg-[#0284C7]/10 blur-3xl" />
      </div>

      <PublicHeader />
      <div className="flex-1 relative">
        <Outlet />
      </div>
      <PublicFooter />
    </div>
  );
}
