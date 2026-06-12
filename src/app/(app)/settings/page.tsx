import { KeyRound, Link2, Moon, UserCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-4 w-4" />Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{session?.user?.name}</p>
          <p className="text-muted-foreground">{session?.user?.email}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="h-4 w-4" />Corsair Connections</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Gmail and Google Calendar credentials are managed by Corsair with tenant-scoped encrypted storage.</p>
          <p>Run the Corsair auth commands from the README for this user before sending mail or syncing events.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4" />Security</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Authentication is handled with Google Login and database sessions.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Moon className="h-4 w-4" />Appearance</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Dark mode follows the system preference.</CardContent>
      </Card>
    </div>
  );
}
