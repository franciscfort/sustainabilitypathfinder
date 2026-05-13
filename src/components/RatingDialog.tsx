import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ratingSchema, checkClientRateLimit, sanitizeText } from "@/lib/validation";
import { getSessionId } from "@/lib/assessmentStorage";

export function RatingDialog() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Client-side rate limiting (defense-in-depth)
    if (!checkClientRateLimit("rating", 5, 60_000)) {
      toast.error("Too many requests. Please wait a moment and try again.");
      return;
    }

    // Schema-based validation with Zod
    const parsed = ratingSchema.safeParse({
      rating,
      comment: comment || null,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("app_ratings").insert({
      rating: parsed.data.rating,
      comment: parsed.data.comment ? sanitizeText(parsed.data.comment) : null,
      session_id: getSessionId(),
    });
    setIsSubmitting(false);

    if (error) {
      // Handle rate limit from RLS gracefully
      if (error.message?.includes("row-level security")) {
        toast.error("Too many requests. Please wait a moment and try again.");
        return;
      }
      toast.error("Failed to submit rating. Please try again.");
      return;
    }

    toast.success("Thank you for your feedback!");
    setOpen(false);
    setRating(0);
    setComment("");
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="group">
          <Star className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
          Rate This App
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Rate Your Experience</DialogTitle>
          <DialogDescription>
            How would you rate the Career Pathfinder? Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          {/* Star Rating */}
          <div className="flex justify-center gap-2" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors",
                    star <= displayRating
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>
          {displayRating > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {["", "Poor", "Fair", "Good", "Great", "Excellent"][displayRating]}
            </p>
          )}

          {/* Comment - sanitized and length-limited */}
          <Textarea
            aria-label="Feedback comment"
            placeholder="Leave a comment (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            rows={3}
          />
          <p className="text-xs text-muted-foreground text-right">{comment.length}/500</p>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
