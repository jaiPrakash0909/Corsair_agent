import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { auth, signIn } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_40%)]" />

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold">
            C
          </div>
          <span className="text-lg font-semibold">Camail Ai</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#about" className="hover:text-white transition">
            About
          </a>
          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </nav>




<form
  action={async () => {
    "use server";
    await signIn("google", {
      redirectTo: "/dashboard",
    });
  }}
>
  <button
    type="submit"
    className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2 text-sm font-medium hover:bg-zinc-800 transition"
  >
    Login
  </button>
</form>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-24 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
          <Sparkles className="h-4 w-4" />
          AI-Powered Email & Calendar Assistant
        </div>

        <h1 className="max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">
          The AI workspace for
          <br />
          email and scheduling
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Manage Gmail, meetings, and daily workflows using one intelligent
          assistant powered by AI.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">


          <form
  action={async () => {
    "use server";
    await signIn("google", {
      redirectTo: "/dashboard",
    });
  }}
>
          <button type="submit"
            
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:scale-[1.02]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
</form>
          <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 font-medium hover:bg-zinc-800 transition">
            Watch Demo
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 w-full max-w-6xl">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur">
            <div className="rounded-2xl border border-zinc-800 bg-black p-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <p className="text-sm text-zinc-500">Emails Today</p>
                  <h3 className="mt-2 text-3xl font-bold">127</h3>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <p className="text-sm text-zinc-500">Meetings</p>
                  <h3 className="mt-2 text-3xl font-bold">8</h3>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <p className="text-sm text-zinc-500">AI Actions</p>
                  <h3 className="mt-2 text-3xl font-bold">34</h3>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-left">
                <p className="text-zinc-500 text-sm">AI Assistant</p>
                <p className="mt-3 text-white">
                  “Schedule a meeting tomorrow at 3 PM and send an email to the
                  team.”
                </p>

                <div className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/30 p-4 text-emerald-400">
                  ✓ Meeting created successfully
                  <br />
                  ✓ Email sent to team members
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
