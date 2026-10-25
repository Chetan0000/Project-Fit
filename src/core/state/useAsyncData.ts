import { useCallback, useEffect, useState, type DependencyList } from "react";

type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

/**
 * Minimal data-loading hook so no screen fetches inline. Screens call an API
 * endpoint from `@/core/api` here and render `data`. Replaced by TanStack Query
 * when the state layer lands.
 */
export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  const run = useCallback(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    loader().then(
      (data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      },
      (error: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
            loading: false,
          });
        }
      },
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, reload: run };
}
