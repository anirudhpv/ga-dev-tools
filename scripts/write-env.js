// Writes .env.production from environment variables so the site can be built
// non-interactively (e.g. on Cloudflare Pages) without `yarn check-config`.
const fs = require("fs")

const keys = [
  "GAPI_CLIENT_ID",
  "BITLY_CLIENT_ID",
  "AUTH_ENDPOINT",
  "GA_MEASUREMENT_ID",
]
const lines = keys
  .filter(key => process.env[key])
  .map(key => `${key}=${process.env[key]}`)

if (!process.env.GAPI_CLIENT_ID) {
  console.warn("GAPI_CLIENT_ID is not set; sign-in will not work.")
}

fs.writeFileSync(".env.production", lines.join("\n"))
console.log(
  `Wrote .env.production with: ${
    lines.map(l => l.split("=")[0]).join(", ") || "(nothing)"
  }`
)
