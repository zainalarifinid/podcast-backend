import { createConnection } from "typeorm";

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => await createConnection({
            type: 'sqlite',
            database: 'db',
            entities: [
                __dirname + '/../**/entities/**{.ts,.js}',
            ],
            // logging: ['query', 'schema'],
            synchronize: true,
        }),
    }
]
