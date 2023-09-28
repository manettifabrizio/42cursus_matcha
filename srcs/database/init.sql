-- -----------------------------------------------------------------------------
-- Schema
-- -----------------------------------------------------------------------------
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


CREATE TABLE IF NOT EXISTS "accounts"
(
	"id"        SERIAL  PRIMARY KEY,
	"username"  VARCHAR NOT NULL UNIQUE,
	"password"  VARCHAR NOT NULL,
	"email"     VARCHAR NOT NULL UNIQUE,
	"email_new" VARCHAR NOT NULL UNIQUE,
	"secret"    VARCHAR     NULL,
	"confirmed" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "users"
(
	"id"          INTEGER                PRIMARY KEY REFERENCES "accounts" ON DELETE CASCADE,
	"id_picture"  INTEGER                    NULL,
	"firstname"   VARCHAR                NOT NULL,
	"lastname"    VARCHAR                NOT NULL,
	"birthdate"   TIMESTAMP                  NULL,
	"gender"      Gender                     NULL,
	"orientation" Orientation                NULL,
	"biography"   TEXT                       NULL,
	"location"    GEOGRAPHY(POINT, 4326)     NULL
);

CREATE TABLE IF NOT EXISTS "likes"
(
	"id_user_from" INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	PRIMARY KEY ("id_user_from", "id_user_to")
);

CREATE TABLE IF NOT EXISTS "reports"
(
	"id_user_from" INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	PRIMARY KEY ("id_user_from", "id_user_to")
);

CREATE TABLE IF NOT EXISTS "blocks"
(
	"id_user_from" INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	PRIMARY KEY ("id_user_from", "id_user_to")
);

CREATE TABLE IF NOT EXISTS "tags"
(
	"id"   SERIAL  PRIMARY KEY,
	"name" VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "users_tags"
(
	"id_user" INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_tag"  INTEGER NOT NULL REFERENCES "tags"  ON DELETE CASCADE,
	PRIMARY KEY ("id_user", "id_tag")
);

CREATE TABLE IF NOT EXISTS "pictures"
(
	"id"      SERIAL  PRIMARY KEY,
	"id_user" INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"name"    VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "users_pictures"
(
	"id_user"    INTEGER NOT NULL REFERENCES "users"    ON DELETE CASCADE,
	"id_picture" INTEGER NOT NULL REFERENCES "pictures" ON DELETE CASCADE,
	PRIMARY KEY ("id_user", "id_picture")
);

ALTER TABLE "users"
	ADD FOREIGN KEY ("id_picture") REFERENCES "pictures" ON DELETE SET NULL
;
