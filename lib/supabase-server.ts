// Server-side stub — offline mode, no server DB needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any

const chainProxy: any = new Proxy({}, {
  get() {
    return (..._args: any[]) => chainProxy;
  },
});

// Make it thenable so await works
chainProxy.then = (resolve: any) => resolve({ data: [], error: null });

export function createServerSupabaseClient() {
  return {
    from: (_table: string) => chainProxy,
  };
}
