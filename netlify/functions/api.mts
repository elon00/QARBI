export { qarbiApi as default } from "../../src/lib/qarbi-api.js";

export const config = {
  path: "/api/*",
  rateLimit: { windowSize: 60, windowLimit: 30, aggregateBy: ["ip"] },
};
