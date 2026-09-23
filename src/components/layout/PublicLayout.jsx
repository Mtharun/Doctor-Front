import { Outlet } from "react-router";
import PublicHeader from "./PublicHeader.jsx";
import PublicFooter from "./PublicFooter.jsx";

// Shared shell for every public marketing page (Home, About, Services,
// Contact, ...) so the header/nav and footer never drift out of sync
// between pages.
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <PublicFooter />
    </div>
  );
}
