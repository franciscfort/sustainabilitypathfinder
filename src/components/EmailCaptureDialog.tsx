import { useState } from "react";
import { Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { emailSchema, checkClientRateLimit } from "@/lib/validation";
import { detectCountry } from "@/lib/geo";

interface EmailCaptureDialogProps {
  onEmailSubmitted: () => void;
  assessmentId?: string | null;
  sessionId?: string;
}

export function EmailCaptureDialog({ onEmailSubmitted, assessmentId, sessionId }: EmailCaptureDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side rate limiting (defense-in-depth; DB enforces server-side)
    if (!checkClientRateLimit("email_capture", 5, 60_000)) {
      toast.error("Too many requests. Please wait a moment and try again.");
      return;
    }

    // Schema-based validation with Zod
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const country = await detectCountry();
      const { error: dbError } = await supabase
        .from("email_captures")
        .insert({
          email: result.data,
          assessment_id: assessmentId ?? null,
          session_id: sessionId ?? null,
          country,
        });

      if (dbError) {
        // Handle rate limit 429-style errors from RLS gracefully
        if (dbError.message?.includes("row-level security")) {
          toast.error("Too many requests. Please wait a moment and try again.");
          return;
        }
        throw dbError;
      }

      setOpen(false);
      setEmail("");
      toast.success("Generating your PDF...");
      onEmailSubmitted();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="group">
          <Download className="w-4 h-4 mr-2" />
          Download Results PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Get Your Results
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Enter your email to download your career results as a PDF.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              maxLength={255}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Processing..." : "Download PDF"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. No spam, ever.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
