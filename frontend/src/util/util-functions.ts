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
