import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface RatingData {
  averageRating: number;
  totalRatings: number;
  recentComments: { rating: number; comment: string; created_at: string }[];
}

export function SocialProof() {
  const [data, setData] = useState<RatingData | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data: ratings } = await supabase
        .from("app_ratings")
        .select("rating, comment, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!ratings || ratings.length === 0) return;

      const avg = ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
      const recentComments = ratings
        .filter((r) => r.comment)
        .slice(0, 3)
        .map((r) => ({ rating: r.rating, comment: r.comment!, created_at: r.created_at }));

      setData({ averageRating: avg, totalRatings: ratings.length, recentComments });
    }
    fetch();
  }, []);

  if (!data) return null;

  return (
    <section className="px-4 py-12">
      <div className="max-w-3xl mx-auto text-center animate-fade-in">
        {/* Average Rating */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-5 h-5",
                star <= Math.round(data.averageRating)
                  ? "fill-accent text-accent"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          <span className="font-semibold text-foreground">{data.averageRating.toFixed(1)}</span> out of 5 from{" "}
          <span className="font-semibold text-foreground">{data.totalRatings}</span> rating{data.totalRatings !== 1 ? "s" : ""}
        </p>

        {/* Recent Comments */}
        {data.recentComments.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {data.recentComments.map((item, i) => (
              <div key={i} className="bg-card rounded-xl p-5 shadow-card text-left">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-3.5 h-3.5",
                        s <= item.rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{item.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
