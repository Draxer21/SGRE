import { useEffect } from "react";

/**
 * Loads one or more Django backend CSS bundles dynamically while the component is mounted.
 * Accepts a style name or an array of names (matching the filenames in /static/css).
 */
export function useBackendStyles(names) {
  const baseNames = Array.isArray(names) ? names : [names];
  const normalizedNames = Array.from(
    new Set(baseNames.filter((name) => typeof name === "string" && name.length)),
  );
  const dependencyKey = normalizedNames.join("|");

  useEffect(() => {
    if (normalizedNames.length === 0) {
      return () => {};
    }

    const origin =
      import.meta.env.VITE_BACKEND_ORIGIN ?? "http://localhost:8000";
    const appended = [];

    normalizedNames.forEach((styleName) => {
      const selector = `link[data-backend-style="${styleName}"]`;
      let link = document.head.querySelector(selector);

      if (link) {
        const nextCount = Number(link.dataset.usageCount ?? "0") + 1;
        link.dataset.usageCount = String(nextCount);
        appended.push(styleName);
        return;
      }

      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${origin}/static/css/${styleName}.css`;
      link.dataset.backendStyle = styleName;
      link.dataset.usageCount = "1";

      document.head.appendChild(link);
      appended.push(styleName);
    });

    return () => {
      appended.forEach((styleName) => {
        const selector = `link[data-backend-style="${styleName}"]`;
        const link = document.head.querySelector(selector);
        if (!link) {
          return;
        }
        const nextCount = Number(link.dataset.usageCount ?? "1") - 1;
        if (nextCount <= 0) {
          link.remove();
        } else {
          link.dataset.usageCount = String(nextCount);
        }
      });
    };
  }, [dependencyKey]);
}
