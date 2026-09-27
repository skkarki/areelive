import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { downloadCSV } from "@/lib/csv";
import type { Database } from "@/integrations/supabase/types";

type Referral = Database["public"]["Tables"]["broadcaster_referrals"]["Row"];
type Status = Database["public"]["Enums"]["referral_status"];

const STATUSES: Status[] = ["pending","contacted","approved","active","bonus_eligible","bonus_paid","rejected"];

export const Route = createFileRoute("/_authenticated/admin/referrals")({
  component: ReferralsAdmin,
});

function ReferralsAdmin() {
  const [rows, setRows] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("broadcaster_referrals").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter(r =>
    statusFilter === "all" || r.status === statusFilter
  ), [rows, statusFilter]);

  const updateRow = async (id: string, patch: Partial<Referral>) => {
    setSavingId(id);
    const { error } = await supabase.from("broadcaster_referrals").update(patch).eq("id", id);
    setSavingId(null);
    if (error) return alert(error.message);
    setRows(r => r.map(x => x.id === id ? { ...x, ...patch } : x));
  };

  const exportCSV = () => {
    downloadCSV(`areelive-referrals-${new Date().toISOString().slice(0,10)}.csv`, filtered as unknown as Record<string, unknown>[]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Broadcaster referrals</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {rows.length} shown</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | "all")}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
          <Button size="sm" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No referrals yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Invited friend</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <Fragment key={r.id}>
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.referrer_name}</div>
                      <div className="text-xs text-muted-foreground">ID: {r.referrer_areelive_id} · {r.referrer_phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{r.friend_name}</div>
                      <div className="text-xs text-muted-foreground">{r.friend_phone}</div>
                    </TableCell>
                    <TableCell className="text-sm">{r.friend_country_city}</TableCell>
                    <TableCell>
                      <Select value={r.status} onValueChange={(v) => updateRow(r.id, { status: v as Status })}>
                        <SelectTrigger className="h-8 w-40"><Badge variant="secondary">{r.status.replace("_"," ")}</Badge></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setExpanded(expanded === r.id ? null : r.id);
                        setNotesDraft(n => ({ ...n, [r.id]: r.admin_notes ?? "" }));
                      }}>
                        {expanded === r.id ? "Close" : "Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expanded === r.id && (
                    <TableRow key={r.id + "-x"}>
                      <TableCell colSpan={6} className="bg-muted/30">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="text-sm space-y-1">
                            <p><span className="text-muted-foreground">Prior experience:</span> {r.friend_prior_experience ? "Yes" : "No"}</p>
                            <p><span className="text-muted-foreground">Social:</span> {r.friend_social_link ? (/^https?:\/\//i.test(r.friend_social_link) ? <a className="text-primary underline" href={r.friend_social_link} target="_blank" rel="noreferrer noopener">{r.friend_social_link}</a> : <span className="text-muted-foreground">{r.friend_social_link} (blocked: unsafe URL)</span>) : "—"}</p>
                            <p className="pt-1"><span className="text-muted-foreground">Note:</span></p>
                            <p className="whitespace-pre-wrap text-sm">{r.note || "—"}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Internal notes</label>
                            <Textarea rows={5} value={notesDraft[r.id] ?? ""} onChange={(e) => setNotesDraft(n => ({ ...n, [r.id]: e.target.value }))} />
                            <Button size="sm" disabled={savingId === r.id} onClick={() => updateRow(r.id, { admin_notes: notesDraft[r.id] ?? null })}>
                              {savingId === r.id ? "Saving…" : "Save notes"}
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}