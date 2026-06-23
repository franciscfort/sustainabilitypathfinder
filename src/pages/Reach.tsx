import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Globe2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { codeToFlag, codeToName } from "@/lib/countries";

interface CountryStat {
  country: string;
  count: number;
}

const Reach = () => {
  const [stats, setStats] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAssessments, setTotalAssessments] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data, error }, { data: assessmentCount, error: assessmentError }] = await Promise.all([
        supabase.rpc("get_country_stats"),
        supabase.rpc("get_total_assessments"),
      ]);
      if (error || assessmentError) {
        setError((error?.message || assessmentError?.message) ?? "Failed to load reach data");
      } else {
        setStats(
          (data ?? []).map((r: any) => ({ country: r.country, count: Number(r.count) }))
        );
        setTotalAssessments(assessmentCount ? Number(assessmentCount) : null);
      }
      setLoading(false);
    })();
  }, []);

  const known = stats.filter((s) => s.country !== "UNKNOWN");
  const totalInteractions = stats.reduce((sum, s) => sum + s.count, 0);
  const uniqueCountries = known.length;

  return (
    <>
      <Helmet>
        <title>Sustainability Pathfinder Reach — Countries Reached</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <Globe2 className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Sustainability Pathfinder Reach</h1>
            <p className="text-muted-foreground">Countries the Sustainability Career Pathfinder has reached.</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground font-medium">Total interactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{totalInteractions}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground font-medium">Unique countries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{uniqueCountries}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No interactions yet.</p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {stats.map((s) => (
                        <li key={s.country} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl" aria-hidden>
                              {s.country === "UNKNOWN" ? "🌍" : codeToFlag(s.country)}
                            </span>
                            <span className="font-medium">{codeToName(s.country)}</span>
                            {s.country !== "UNKNOWN" && (
                              <span className="text-xs text-muted-foreground">{s.country}</span>
                            )}
                          </div>
                          <span className="font-semibold tabular-nums">{s.count}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Country detection is best-effort via IP and may be unavailable for some visitors.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Reach;
