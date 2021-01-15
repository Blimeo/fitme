import { useEffect } from "react";

export const emailIsValid = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Update the document title with provided string
 * @param titleOrFn can be a String or a function.
 * @param deps? if provided, the title will be updated when one of these values changes
 */
export const useTitle = (
  titleOrFn: string | (() => string),
  ...deps: any[]
) => {
  useEffect(
    () => {
      document.title =
        typeof titleOrFn === "function" ? titleOrFn() : titleOrFn;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps]
  );
};

/**
 * Compares two arrays for equality without regard to ordering
 */
export function arraysSetEquality<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  const aSorted = [...a].sort();
  const bSorted = [...b].sort();
  for (let i = 0; i < aSorted.length; ++i) {
    if (aSorted[i] !== bSorted[i]) return false;
  }
  return true;
}
