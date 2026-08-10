type Mode = 'live' | 'fixture';
export interface ServerEnv {
  YOUCAM_MODE: Mode;
  YOUCAM_CLIENT_ID?: string;
  YOUCAM_CLIENT_SECRET?: string;
  YOUCAM_PUBLIC_KEY?: string;
  YOUCAM_BASE_URL: string;
  DATABASE_URL: string;
}
export function getServerEnv(): ServerEnv {
  const mode = (process.env.YOUCAM_MODE ?? 'fixture') as Mode;
  const env: ServerEnv = {
    YOUCAM_MODE: mode,
    YOUCAM_CLIENT_ID: process.env.YOUCAM_CLIENT_ID,
    YOUCAM_CLIENT_SECRET: process.env.YOUCAM_CLIENT_SECRET,
    YOUCAM_PUBLIC_KEY: process.env.YOUCAM_PUBLIC_KEY,
    YOUCAM_BASE_URL: process.env.YOUCAM_BASE_URL ?? 'https://yce-api-01.perfectcorp.com',
    DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db',
  };
  if (mode === 'live') {
    for (const k of ['YOUCAM_CLIENT_ID', 'YOUCAM_CLIENT_SECRET', 'YOUCAM_PUBLIC_KEY'] as const) {
      if (!env[k]) throw new Error(`${k} is required when YOUCAM_MODE=live`);
    }
  }
  return env;
}
