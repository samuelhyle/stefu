/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_MUX_TOKEN_ID: string
  readonly VITE_MUX_TOKEN_SECRET: string
  readonly VITE_MUX_SIGNING_KEY_ID: string
  readonly VITE_MUX_SIGNING_KEY_PRIVATE: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_ADMIN_EMAIL: string
  readonly VITE_GAME_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
