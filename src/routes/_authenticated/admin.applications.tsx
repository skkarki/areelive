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

type Application = Database["public"]["Tables"]["applications"]["Row"];
type Status = Database["public"]["Enums"]["application_status"];
type RoleF = Database["public"]["Enums"]["application_role"] | "all";

const ROLE_LABEL: Record<Database["public"]["Enums"]["application_role"], string> = {
  agency: "Agency", recruiter: "Recruiter", host: "Host", admin: "Admin", agency_manager: "Agency Manager",
  creator: "Creator", merchant: "Merchant",
};
const STATUS_COLOR: Record<Status, string> = {
  pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  reviewed: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  approved: "bg-green-500/15 text-green-700 dark:text-green-400",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export const Route = createFileRoute("/_authenticated/admin/applications")({
  component: ApplicationsAdmin,
});

function ApplicationsAdmin() {
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<RoleF>("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter(r =>
    (roleFilter === "all" || r.applying_for === roleFilter) &&
    (statusFilter === "all" || r.status === statusFilter)
  ), [rows, roleFilter, statusFilter]);

  const updateRow = async (id: string, patch: Partial<Application>) => {
    setSavingId(id);
    const { error } = await supabase.from("applications").update(patch).eq("id", id);
    setSavingId(null);
    if (error) return alert(error.message);
    setRows(r => r.map(x => x.id === id ? { ...x, ...patch } : x));
  };

  const exportCSV = () => {
    downloadCSV(`areelive-applications-${new Date().toISOString().slice(0,10)}.csv`, filtered as unknown as Record<string, unknown>[]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {rows.length} shown</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as RoleF)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {Object.entries(ROLE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | "all")}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
          <div className="p-8 text-center text-sm text-muted-foreground">No applications yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Role</TableHead>
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
                      <div className="font-medium">{r.full_name}</div>
                      <div className="text-xs text-muted-foreground">{r.email} · {r.phone}</div>
                    </TableCell>
                    <TableCell>{ROLE_LABEL[r.applying_for]}</TableCell>
                    <TableCell className="text-sm">{r.country_city}</TableCell>
                    <TableCell>
                      <Select value={r.status} onValueChange={(v) => updateRow(r.id, { status: v as Status })}>
                        <SelectTrigger className="h-8 w-36">
                          <Badge variant="secondary" className={STATUS_COLOR[r.status]}>{r.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
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
                            <p><span className="text-muted-foreground">Experience:</span> {r.has_experience ? "Yes" : "No"}</p>
                            <p><span className="text-muted-foreground">Capacity:</span> {r.capacity_estimate || "—"}</p>
                            <p><span className="text-muted-foreground">Portfolio:</span> {r.portfolio_link ? (/^https?:\/\//i.test(r.portfolio_link) ? <a className="text-primary underline" href={r.portfolio_link} target="_blank" rel="noreferrer noopener">{r.portfolio_link}</a> : <span className="text-muted-foreground">{r.portfolio_link} (blocked: unsafe URL)</span>) : "—"}</p>
                            <p><span className="text-muted-foreground">Agency:</span> {r.agency_name || "—"}</p>
                            <p><span className="text-muted-foreground">Language:</span> {r.preferred_language || "—"}</p>
                            <p className="pt-1"><span className="text-muted-foreground">Message:</span></p>
                            <p className="whitespace-pre-wrap text-sm">{r.message || "—"}</p>
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