-- -----------------------------------------------------------------------------
-- Schema
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "accounts"
(
	"id"          SERIAL     PRIMARY KEY,
	"username"    VARCHAR    NOT NULL UNIQUE,
	"password"    VARCHAR    NOT NULL,
	"email"       VARCHAR    NOT NULL,
	"secret"      VARCHAR        NULL,
	"created_at"  TIMESTAMP  NOT NULL DEFAULT NOW(),
	"updated_at"  TIMESTAMP  NOT NULL DEFAULT NOW()
);
