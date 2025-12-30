import app from './app';
import config from '@core/config/app.config';
import { prisma } from '@core/database/prisma';

const main = async () => {
  // Start server
  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};


main();
