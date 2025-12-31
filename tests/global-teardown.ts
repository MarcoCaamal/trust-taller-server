import { execSync } from "node:child_process";

export default async () => {
  execSync("docker compose -f docker-compose.test.yml down -v", {
    stdio: "inherit",
  });
};
