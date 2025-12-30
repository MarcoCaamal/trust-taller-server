import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from './generated/prisma/client';

import config from '@core/config/app.config';

const connectionString = `${config.databaseUrl}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export type DbClient = PrismaClient | Prisma.TransactionClient;

export { prisma }
