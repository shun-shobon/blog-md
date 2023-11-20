export function isLocalPath(path: string): boolean {
  try {
    new URL(path);

    return false;
  } catch {
    return true;
  }
}
