const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.APP_URL,
].filter(Boolean);

if (process.env.NODE_ENV !== "production") {
  configuredOrigins.push("http://localhost:5173");
}

export function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (configuredOrigins.length === 0) return true;
  return configuredOrigins.includes(origin);
}
