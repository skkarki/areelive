import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const checkRole = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return setIsAdmin(false);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (error) console.error(error);
    setIsAdmin(!!data);
  };

  useEffect(() => { checkRole(); }, []);

  const claimAdmin = async () => {
    setClaiming(true); setMsg(null);
    const { data, error } = await supabase.rpc("claim_first_admin");
    setClaiming(false);
    if (error) return setMsg(error.message);
    if (data) { setMsg("You are now an admin."); checkRole(); }
    else setMsg("An admin already exists. Ask an existing admin to grant you access.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md text-center rounded-xl border bg-card p-6">
          <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-3 text-xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is signed in but does not have the admin role. If you are the first admin, you can claim admin below.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={claimAdmin} disabled={claiming}>{claiming ? "Claiming…" : "Claim first admin"}</Button>
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
          {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-black tracking-tight">AREELIVE</Link>
            <nav className="flex flex-wrap items-center gap-1 text-sm">
              <Link to="/admin/applications" className={`px-3 py-1.5 rounded-md ${path.includes("/admin/applications") ? "bg-secondary" : "hover:bg-secondary/50"}`}>Applications</Link>
              <Link to="/admin/referrals" className={`px-3 py-1.5 rounded-md ${path.includes("/admin/referrals") ? "bg-secondary" : "hover:bg-secondary/50"}`}>Referrals</Link>
              <Link to="/admin/careers" className={`px-3 py-1.5 rounded-md ${path.includes("/admin/careers") ? "bg-secondary" : "hover:bg-secondary/50"}`}>Careers</Link>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4"><Outlet /></main>
    </div>
  );
}
