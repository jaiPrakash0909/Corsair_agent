import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { auth, signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-lg border glass p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Corsair Agent AI</h1>
            <p className="text-sm text-muted-foreground">Your AI email and calendar cockpit.</p>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button className="w-full" type="submit">Continue with Google</Button>
        </form>
      </div>
    </main>
  );
}
