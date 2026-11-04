import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent, OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/analytics";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setOpen(true);
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpen);
  }, []);

  if (!open) return null;

  const choose = (v: "accepted" | "essential") => {
    setConsent(v);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="max-w-3xl mx-auto rounded-xl border border-border bg-card text-card-foreground shadow-lg p-4 sm:p-5">
        <h2 className="font-semibold text-base mb-1">We use a few cookies</h2>
        <p className="text-sm text-muted-foreground">
          Essential cookies keep the site working. With your permission, we'd also like to use anonymous
          analytics to see which pages help people most. We never record your screen or sell your data.{" "}
          <Link to="/privacy" className="underline text-primary">Privacy Policy</Link>
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button variant="outline" className="w-full" onClick={() => choose("accepted")}>
            Accept analytics
          </Button>
          <Button variant="outline" className="w-full" onClick={() => choose("essential")}>
            Essential only
          </Button>
        </div>
      </div>
    </div>
  );
}
