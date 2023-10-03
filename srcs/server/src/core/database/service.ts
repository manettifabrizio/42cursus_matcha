import type { PoolClient } from "pg";
import type { Cause } from "./exception";
import type { DatabaseService } from "./types";
import { DatabaseError } from "pg";
import { Pool } from "pg";
import * as Config from "@/Config";
import { DatabaseException } from "./exception";

// Variable --------------------------------------------------------------------
const pool = new Pool({
  host: Config.DB_HOST,
  port: Number.parseInt(Config.DB_PORT),
  database: Config.DB_NAME,
  user: Config.DB_USER,
  password: Config.DB_PASS,
});

pool.on("error", (err, client) => {
  throw new DatabaseException({
    cause: "Pool:Initialization",
    message: err.message,
  });
});

// Service ---------------------------------------------------------------------
export const service: DatabaseService = ((pool: Pool) => {
  let client: PoolClient | null = null;

  const query: DatabaseService["query"] = async (sql, values) => {
    try {
      return await (client ?? pool).query(sql, values);
    } catch (err: unknown) {
      if (!(err instanceof DatabaseError)) {
        throw err;
      }

      // Todo: Better handling of errors
      // https://www.postgresql.org/docs/current/errcodes-appendix.html
      const causes: Record<string, Cause> = {
        "23505": "Query:ConstraintsViolation:Unique",
        "23503": "Query:ConstraintsViolation:ForeignKey",
        "23001": "Query:ConstraintsViolation:Restrict",
      };

      const column =
        err.detail?.substring(
          err.detail.indexOf("(") + 1,
          err.detail.indexOf(")")
        ) ?? "unknown";

      throw new DatabaseException({
        cause: causes[err.code ?? ""] ?? "Query::Unknown",
        message: err.message,
        details: { column },
      });
    }
  };

  const startTransaction: DatabaseService["startTransaction"] = async () => {
    if (!client) {
      client = await pool.connect();
    }

    await query(`BEGIN`);
  };

  const commitTransaction: DatabaseService["commitTransaction"] = async () => {
    await query(`COMMIT`);
  };

  const cancelTransaction: DatabaseService["cancelTransaction"] = async () => {
    await query(`ROLLBACK`);
  };

  const releaseClient: DatabaseService["releaseClient"] = () => {
    client?.release();
    client = null;
  };

  return {
    releaseClient,
    startTransaction,
    commitTransaction,
    cancelTransaction,
    query,
  };
})(pool);
