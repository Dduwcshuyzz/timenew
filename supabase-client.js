(function () {
  const config = window.LIMO_GO_CONFIG || {};

  if (!window.supabase || !config.supabaseUrl || !config.supabaseAnonKey) {
    window.limoGoSupabase = {
      auth: {
        getUser: async () => ({ data: { user: null } }),
        getSession: async () => ({ data: { session: null } }),
        signInWithPassword: async () => ({
          data: { user: null },
          error: { message: "Supabase chưa được cấu hình. Đã chuyển sang chế độ demo." }
        }),
        signUp: async () => ({
          data: { user: null, session: null },
          error: { message: "Supabase chưa được cấu hình. Đã chuyển sang chế độ demo." }
        })
      },
      from: () => ({
        insert: async () => ({ data: null, error: null }),
        select: () => ({ single: async () => ({ data: null, error: null }) })
      })
    };
    return;
  }

  window.limoGoSupabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
})();
