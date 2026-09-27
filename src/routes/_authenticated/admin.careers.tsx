import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { CAREER_BUCKET } from "@/lib/career-validation";
import { Button } from "@/components/ui/button";
import { Loader2, Download, RefreshCw } from "lucide-react";

type Application = Database["public"]["Tables"]["career_applications"]["Row"];
type Status = Application["status"];
export const Route = createFileRoute("/_authenticated/admin/careers")({ component: CareerReview });

function CareerReview() {
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "all">("all");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: loadError } = await supabase
        .from("career_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (loadError) throw loadError;
      setRows(data ?? []);
    } catch {
      setError(
        "Career applications could not be loaded. Check your access and the Careers database setup, then try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(row: Application, status: Status) {
    setBusy(row.id);
    setError("");
    try {
      const { data, error: updateError } = await supabase
        .from("career_applications")
        .update({ status })
        .eq("id", row.id)
        .select()
        .single();
      if (updateError) throw updateError;
      setRows((previous) => previous.map((item) => (item.id === row.id ? data : item)));
    } catch {
      setError("The review status could not be saved. Please try again.");
    } finally {
      setBusy(null);
    }
  }
  async function download(path: string, filename: string) {
    setBusy(path);
    setError("");
    try {
      const { data, error: downloadError } = await supabase.storage
        .from(CAREER_BUCKET)
        .download(path);
      if (downloadError || !data) throw downloadError;
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("The document could not be downloaded. Please try again.");
    } finally {
      setBusy(null);
    }
  }
  const filtered = rows.filter((row) => filter === "all" || row.status === filter);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Career Applications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review candidates and their private CVs and recommendation letters.
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <label htmlFor="career-status-filter" className="text-sm">
          Status
        </label>
        <select
          id="career-status-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value as Status | "all")}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All applications</option>
          {["pending", "reviewed", "approved", "rejected"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {loading ? (
        <div role="status" className="p-8 text-center">
          <Loader2 aria-hidden="true" className="mx-auto h-6 w-6 animate-spin" />
          <span className="sr-only">Loading applications</span>
        </div>
      ) : !error && filtered.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No applications match this status.
        </p>
      ) : (
        filtered.map((row) => (
          <article key={row.id} className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{row.full_name}</h2>
                <p className="mt-1 text-sm text-primary">{row.position}</p>
                <p className="mt-2 break-words text-sm text-muted-foreground">
                  {row.email} · {row.phone} · {row.country_city}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Submitted {new Date(row.created_at).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor={`status-${row.id}`} className="block text-xs">
                  Review Status
                </label>
                <select
                  id={`status-${row.id}`}
                  value={row.status}
                  disabled={busy !== null}
                  onChange={(event) => void updateStatus(row, event.target.value as Status)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {["pending", "reviewed", "approved", "rejected"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {row.cover_letter && (
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {row.cover_letter}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                disabled={busy !== null}
                onClick={() => void download(row.cv_path, row.cv_name)}
              >
                <Download className="h-4 w-4" />
                Download CV
              </Button>
              {row.recommendation_path && row.recommendation_name && (
                <Button
                  variant="outline"
                  disabled={busy !== null}
                  onClick={() => void download(row.recommendation_path!, row.recommendation_name!)}
                >
                  <Download className="h-4 w-4" />
                  Download Recommendation Letter
                </Button>
              )}
            </div>
          </article>
        ))
      )}
    </div>
  );
}
