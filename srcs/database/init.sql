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
	"id"           SERIAL  PRIMARY KEY,
	"username"     VARCHAR NOT NULL UNIQUE,
	"password"     VARCHAR NOT NULL,
	"email"        VARCHAR NOT NULL UNIQUE,
	"email_new"    VARCHAR NOT NULL UNIQUE,
	"secret"       VARCHAR     NULL,
	"is_confirmed" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "users"
(
	"id"           INTEGER                PRIMARY KEY REFERENCES "accounts" ON DELETE CASCADE,
	"id_picture"   INTEGER                    NULL,
	"firstname"    VARCHAR                NOT NULL,
	"lastname"     VARCHAR                NOT NULL,
	"birthdate"    TIMESTAMP                  NULL,
	"gender"       Gender                 NOT NULL DEFAULT 'MALE',
	"orientation"  Orientation            NOT NULL DEFAULT 'BISEXUAL',
	"biography"    TEXT                   NOT NULL DEFAULT '',
	"location"     GEOGRAPHY(POINT, 4326)     NULL,
	"last_seen_at" TIMESTAMP              NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "messages"
(
	"id"           SERIAL   PRIMARY KEY,
	"id_user_from" INTEGER   NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER   NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"content"      TEXT      NOT NULL,
	"created_at"   TIMESTAMP NOT NULL DEFAULT NOW()
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

ALTER TABLE "users"
	ADD FOREIGN KEY ("id_picture") REFERENCES "pictures" ON DELETE SET NULL
;

CREATE TABLE IF NOT EXISTS "activities"
(
	"id_user_from" INTEGER   NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"id_user_to"   INTEGER   NOT NULL REFERENCES "users" ON DELETE CASCADE,
	"action"       Activity  NOT NULL,
	"created_at"   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX activites_user_from ON activities (id_user_from);
CREATE INDEX activites_user_to   ON activities (id_user_to);

-- -----------------------------------------------------------------------------
-- Procedure
-- -----------------------------------------------------------------------------
--  Limit user's pictures count
CREATE OR REPLACE FUNCTION limit_user_pictures_count() RETURNS trigger AS $$
DECLARE
	pictures_count_max INTEGER := 5;
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
			RAISE EXCEPTION 'Cannot have more than % pictures.', pictures_count_max
			USING ERRCODE = '23001', DETAIL = '(picture)';
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
		IF (NEW.id_picture IS NOT NULL) THEN
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
			RAISE EXCEPTION 'Cannot use someone else picture as profile picture.'
			USING ERRCODE = '23001', DETAIL = '(id_picture)';
		END IF;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restrict_user_picture_owner
	BEFORE INSERT OR UPDATE ON users
	FOR EACH ROW EXECUTE PROCEDURE restrict_user_picture_owner();

-- Get matching (gender, orientation) to someone
CREATE OR REPLACE FUNCTION get_matching_types(_gender Gender, _orientation Orientation)
	RETURNS TABLE (
		gender Gender,
		orientation Orientation
	)
AS $$
BEGIN
	IF (_gender = 'MALE') THEN
		IF (_orientation = 'HOMOSEXUAL')
		THEN
			RETURN QUERY SELECT * FROM (VALUES
				('MALE'::Gender, 'HOMOSEXUAL'::Orientation),
				('MALE'::Gender, 'BISEXUAL'::Orientation)
			) AS t(gender, orientation);

		ELSIF (_orientation = 'HETEROSEXUAL')
		THEN
			RETURN QUERY SELECT * FROM (VALUES
				('FEMALE'::Gender, 'HETEROSEXUAL'::Orientation),
				('FEMALE'::Gender, 'BISEXUAL'::Orientation)
			) AS t(gender, orientation);

		ELSE -- _orientation = BISEXUAL
			RETURN QUERY SELECT * FROM (VALUES
				('MALE'::Gender, 'HOMOSEXUAL'::Orientation),
				('MALE'::Gender, 'BISEXUAL'::Orientation),
				('FEMALE'::Gender, 'HETEROSEXUAL'::Orientation),
				('FEMALE'::Gender, 'BISEXUAL'::Orientation)
			) AS t(gender, orientation);
		END IF;
	ELSE -- _gender = FEMALE
		IF (_orientation = 'HOMOSEXUAL')
		THEN
			RETURN QUERY SELECT * FROM (VALUES
				('FEMALE'::Gender, 'HOMOSEXUAL'::Orientation),
				('FEMALE'::Gender, 'BISEXUAL'::Orientation)
			) AS t(gender, orientation);

		ELSIF (_orientation = 'HETEROSEXUAL')
		THEN
			RETURN QUERY SELECT * FROM (VALUES
				('MALE'::Gender, 'HETEROSEXUAL'::Orientation),
				('MALE'::Gender, 'BISEXUAL'::Orientation)
			) AS t(gender, orientation);

		ELSE -- _orientation = BISEXUAL
			RETURN QUERY SELECT * FROM (VALUES
				('FEMALE'::Gender, 'HOMOSEXUAL'::Orientation),
				('FEMALE'::Gender, 'BISEXUAL'::Orientation),
				('MALE'::Gender, 'HETEROSEXUAL'::Orientation),
				('MALE'::Gender, 'BISEXUAL'::Orientation)
			) AS t(gender, orientation);
		END IF;
	END IF;
END
$$ LANGUAGE plpgsql;

--  Limit user's tags count
CREATE OR REPLACE FUNCTION limit_user_tags_count() RETURNS trigger AS $$
DECLARE
	tags_count_max INTEGER := 8;
	tags_count INTEGER := 0;
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
		LOCK TABLE users_tags IN EXCLUSIVE MODE;

		SELECT INTO
			tags_count COUNT(*)
		FROM
			users_tags
		WHERE
			id_user = NEW.id_user;

		IF tags_count >= tags_count_max THEN
			RAISE EXCEPTION 'Cannot have more than % tags.', tags_count_max
			USING ERRCODE = '23001', DETAIL = '(tags)';
		END IF;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_user_tags_count
	BEFORE INSERT OR UPDATE ON users_tags
	FOR EACH ROW EXECUTE PROCEDURE limit_user_tags_count();
