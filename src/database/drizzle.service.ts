import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DrizzleService {
  public readonly client: NodePgDatabase;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL as string,
    });

    this.client = drizzle(pool);
  }
}
