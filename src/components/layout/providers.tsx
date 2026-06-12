"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useState } from "react";
import { CommandPalette } from "@/features/command/command-palette";
import { useCommandPaletteShortcut } from "@/hooks/use-command-palette";

function ShortcutProvider({ children }: { children: React.ReactNode }) {
  useCommandPaletteShortcut();
  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ShortcutProvider>
          {children}
          <CommandPalette />
          <Toaster richColors position="top-right" />
        </ShortcutProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
