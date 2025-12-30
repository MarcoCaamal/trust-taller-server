import { DbClient } from "@core/database/prisma";

export type RepositoryFactory<T> = (client?: DbClient) => T;
