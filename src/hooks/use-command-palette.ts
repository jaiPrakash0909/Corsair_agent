"use client";

import { useEffect } from "react";
import { useUiStore } from "@/store/ui-store";

export function useCommandPaletteShortcut() {
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandOpen]);
}
