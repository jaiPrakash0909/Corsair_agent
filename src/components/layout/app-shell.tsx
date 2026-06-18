import { RecentChats } from "@/components/layout/recent-chats";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
Inbox,
CalendarDays,
Sparkles,
Settings,
Search,
Plus,
} from "lucide-react";

import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/features/search/global-search";

const workspaceItems = [
{
href: "/assistant",
  label: "New Chat",
  icon: Sparkles,
},
{
href: "/inbox",
label: "Inbox",
icon: Inbox,
},
{
href: "/calendar",
label: "Calendar",
icon: CalendarDays,
},
{
href: "/settings",
label: "Settings",
icon: Settings,
},
];

export async function AppShell({
children,
}: {
children: React.ReactNode;
}) {
const session = await auth();

if (!session?.user?.id) {
redirect("/login");
}

return ( <div className="flex h-screen bg-black text-white overflow-hidden">
  <aside className="hidden h-screen w-64 border-r border-zinc-800 bg-zinc-950 lg:flex lg:flex-col"> <div className="p-6"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#127173] font-bold">
C </div>


        <div>
          <h2 className="font-semibold">
            Camail-Ai
          </h2>
          <p className="text-xs text-zinc-500">
            AI Workspace
          </p>
        </div>
      </div>

      <Link href="/assistant">
  <Button
    className="
    mt-6
    w-full
    justify-start
    gap-2
    rounded-xl
    bg-[#127173]
    hover:bg-[#0f5c5d]
    "
  >
    <Plus className="h-4 w-4" />
    New Chat
  </Button>
</Link>
    </div>

    <div className="flex-1 overflow-y-auto px-4">
      <p className="mb-3 px-3 text-xs uppercase tracking-wider text-zinc-500">
        Workspace
      </p>

      <nav className="space-y-1">
        {workspaceItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="
              flex items-center gap-3
              rounded-xl px-3 py-3
              text-zinc-400
              transition
              hover:bg-zinc-900
              hover:text-white
            "
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>


<RecentChats />


    
    </div>

    <div className="mt-auto border-t border-zinc-800 p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
          {session.user.email?.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {session.user.name ?? "User"}
          </p>

          
        </div>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/login",
          });
        }}
      >
        <Button
          type="submit"
          variant="secondary"
          className="w-full"
        >
          Sign out
        </Button>
      </form>
    </div>
  </aside>

  <div className="flex flex-1 flex-col overflow-x-hidden">
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-6">
        <Search className="h-4 w-4 text-zinc-500" />
        <GlobalSearch />
      </div>
    </header>

    <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
      {children}
    </main>
  </div>
</div>


);
}






























