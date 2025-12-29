import app from './app';
import config from '@core/config/app.config';
import { prisma } from '@core/database/prisma';

const main = async () => {
  // Start server
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
}


main()
  .finally(async () => {
    await prisma.$disconnect();
  });
