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

export function RatingDialog() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("app_ratings").insert({
      rating,
      comment: comment.trim() || null,
      session_id: sessionStorage.getItem("session_id"),
    });
    setIsSubmitting(false);

    if (error) {
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
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
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

          {/* Comment */}
          <Textarea
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
