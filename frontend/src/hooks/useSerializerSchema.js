import { useEffect, useState } from "react";

import apiClient from "../services/apiClient.js";

export function useSerializerSchema(resource) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resource) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    apiClient
      .options(`${resource}/`)
      .then((response) => {
        if (!active) {
          return;
        }
        setSchema(response.data?.actions?.POST ?? null);
        setError(null);
      })
      .catch((err) => {
        if (!active) {
          return;
        }
        setSchema(null);
        setError(err);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [resource]);

  return { schema, loading, error };
}
