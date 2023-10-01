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

CREATE TYPE Activity AS ENUM
(
	'WATCHED_PROFILE'
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
	"gender"      Gender                 NOT NULL DEFAULT 'MALE',
	"orientation" Orientation            NOT NULL DEFAULT 'BISEXUAL',
	"biography"   TEXT                   NOT NULL DEFAULT '',
	"location"    GEOGRAPHY(POINT, 4326)     NULL
);

CREATE TABLE IF NOT EXISTS "likes"
(
	"id_user_from" INTEGER   NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER   NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"created_at"   TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY ("id_user_from", "id_user_to")
);

CREATE TABLE IF NOT EXISTS "reports"
(
	"id_user_from" INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"created_at"   TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY ("id_user_from", "id_user_to")
);

CREATE TABLE IF NOT EXISTS "blocks"
(
	"id_user_from" INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"created_at"   TIMESTAMP NOT NULL DEFAULT NOW(),
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
	"path"    VARCHAR NOT NULL UNIQUE
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

CREATE TABLE IF NOT EXISTS "activities"
(
	"id_user_from" INTEGER   NOT NULL INDEX REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER   NOT NULL INDEX REFERENCES "users" ON DELETE CASCADE,
	"action"       Activity  NOT NULL,
	"created_at"   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Procedure
-- -----------------------------------------------------------------------------
--  Limit user's pictures count
CREATE OR REPLACE FUNCTION limit_user_pictures_count() RETURNS trigger AS $$
DECLARE
	pictures_count_max INTEGER := 10;
	pictures_count INTEGER := 0;
	check_required BOOLEAN := false;
BEGIN
	IF TG_OP = 'INSERT' THEN
		check_required := true;
	END IF;

	IF TG_OP = 'UPDATE' THEN
		IF (NEW.id_user != OLD.id_user) THEN
			check_required := true;
		END IF;
	END IF;

	IF check_required THEN
		-- prevent concurrent inserts from multiple transactions
		LOCK TABLE pictures IN EXCLUSIVE MODE;

		SELECT INTO
			pictures_count COUNT(*)
		FROM
			pictures
		WHERE
			id_user = NEW.id_user;

		IF pictures_count >= pictures_count_max THEN
			RAISE EXCEPTION '(picture): Cannot have more than % pictures.', pictures_count_max USING ERRCODE = '23001';
		END IF;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_user_pictures_count
	BEFORE INSERT OR UPDATE ON pictures
	FOR EACH ROW EXECUTE PROCEDURE limit_user_pictures_count();

-- Restrict user's profile picture to one they uploaded themselves
CREATE OR REPLACE FUNCTION restrict_user_picture_owner() RETURNS trigger AS $$
DECLARE
	picture_owner INTEGER := 0;
	check_required BOOLEAN := false;
BEGIN
	IF TG_OP = 'INSERT' THEN
		check_required := true;
	END IF;

	IF TG_OP = 'UPDATE' THEN
		IF (NEW.id_picture IS NOT NULL AND NEW.id_picture != OLD.id_picture) THEN
			check_required := true;
		END IF;
	END IF;

	IF check_required THEN
		SELECT INTO
			picture_owner id_user
		FROM
			pictures
		WHERE
			id = NEW.id_picture;

		IF picture_owner != NEW.id THEN
			RAISE EXCEPTION '(id_picture): Cannot use someone else picture as profile picture.' USING ERRCODE = '23001';
		END IF;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restrict_user_picture_owner
	BEFORE INSERT OR UPDATE ON users
	FOR EACH ROW EXECUTE PROCEDURE restrict_user_picture_owner();
