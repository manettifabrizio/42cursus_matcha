-- -----------------------------------------------------------------------------
-- Schema
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "accounts"
(
	"id"          SERIAL     PRIMARY KEY,
	"username"    VARCHAR    NOT NULL UNIQUE,
	"password"    VARCHAR    NOT NULL,
	"email"       VARCHAR    NOT NULL UNIQUE,
	"secret"      VARCHAR        NULL,
	"created_at"  TIMESTAMP  NOT NULL DEFAULT NOW(),
	"updated_at"  TIMESTAMP  NOT NULL DEFAULT NOW()
);

CREATE TYPE Gender AS ENUM
(
	'MALE',
	'FEMALE'
);

CREATE TYPE Orientation AS ENUM
(
	'BISEXUAL',
	'HETEROSEXUAL',
	'HOMOSEXUAL'
);

CREATE TABLE IF NOT EXISTS "users"
(
	"id"          INTEGER          NOT NULL REFERENCES "accounts" ON DELETE CASCADE,
	"firstname"   VARCHAR(255)     NOT NULL,
	"lastname"    VARCHAR(255)     NOT NULL,
	"birthdate"   TIMESTAMP            NULL,
	"gender"      Gender               NULL,
	"orientation" Orientation          NULL,
	"biography"   TEXT                 NULL,
	"created_at"  TIMESTAMP        NOT NULL DEFAULT NOW(),
	"updated_at"  TIMESTAMP        NOT NULL DEFAULT NOW()
);
