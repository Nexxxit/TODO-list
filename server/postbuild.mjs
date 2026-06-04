import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const distDir = join(dirname(fileURLToPath(import.meta.url)), "dist")

writeFileSync(
    join(distDir, "package.json"),
    JSON.stringify({ type: "commonjs" }) + "\n",
)

console.log("server/dist/package.json written (type: commonjs)")
