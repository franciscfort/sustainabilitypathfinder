import { Link } from "react-router-dom";
import { openCookieSettings } from "@/lib/analytics";

export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 ${className}`}>
      <Link to="/privacy" className="hover:text-foreground underline-offset-2 hover:underline">Privacy Policy</Link>
      <button type="button" onClick={openCookieSettings} className="hover:text-foreground underline-offset-2 hover:underline">
        Cookie settings
      </button>
    </span>
  );
}

export function MiniFooter() {
  return (
    <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      <LegalLinks />
    </footer>
  );
}
