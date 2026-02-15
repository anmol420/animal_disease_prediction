interface EnvConfig {
  WAHIS_API: string;
}

function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  WAHIS_API: getEnv("WAHIS_API"),
};
