import { execa } from "execa"
import { build } from "./build.js"
import { checkConfig, writeEnvFile } from "./check-config.js"
import { Environment } from "./types.js"
const ensureFirebaseLoginStatus = async ({ noLocalhost }) => {
  console.log("Logging out of firebase since tokens are shortlived...")
  await execa("yarn", ["run", "firebase", "logout"])
  return execa(
    "yarn",
    ["run", "firebase", "login", ...(noLocalhost ? ["--no-localhost"] : [])],
    {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    }
  )
}
export const stage = async args => {
  const config = await checkConfig({
    all: false,
  })
  // Always create the .env.production file, but re-write it based on
  // environment.
  await writeEnvFile(
    args.environment === Environment.Production
      ? config.production
      : {
          ...config.staging,
          firebaseProjectId: config.production.firebaseProjectId,
        }
  )
  await ensureFirebaseLoginStatus({ noLocalhost: args.noLocalhost })
  let projectId
  if (args.environment === Environment.Staging) {
    projectId = config.staging.firebaseProjectId
  } else if (args.environment === Environment.Production) {
    projectId = config.production.firebaseProjectId
  } else {
    throw new Error("unreachable")
  }
  await build(false)
  await execa(
    "yarn",
    ["run", "firebase", "--project", projectId, "deploy", "--only", "hosting"],
    {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    }
  )
  return
}
