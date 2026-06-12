type AnyRecord = Record<string, any>;

export async function runFirstAvailable(root: AnyRecord, paths: string[][], payload: AnyRecord) {
  const tried: string[] = [];

  for (const path of paths) {
    let target: any = root;
    for (const segment of path) {
      target = target?.[segment];
    }
    tried.push(path.join("."));
    if (typeof target === "function") {
      return target(payload);
    }
  }

  throw new Error(`Corsair operation unavailable. Tried: ${tried.join(", ")}`);
}

export function pickText(value: AnyRecord, keys: string[]) {
  for (const key of keys) {
    const found = value?.[key] ?? value?.data?.[key];
    if (typeof found === "string" && found.length > 0) {
      return found;
    }
  }
  return "";
}
