CREATE OR REPLACE FUNCTION random_int(low INT, high INT)
   RETURNS INT AS
$$
BEGIN
	RETURN round(random() * (high - low) + low);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_float(low FLOAT, high FLOAT)
   RETURNS FLOAT AS
$$
BEGIN
	RETURN random() * (high - low) + low;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    count_tags INTEGER := 100;
    count_accounts INTEGER := 5000;
    user_id INTEGER := 0;
    picture_id INTEGER := 0;
	t RECORD;
	u RECORD;
BEGIN
	-- CLEAR
	DELETE FROM tags;
	DELETE FROM accounts;
	-- END CLEAR

	-- Loop: Tags
	FOR i IN 1..count_tags LOOP
		-- Create random Tag
		INSERT INTO tags
			( "name" )
		VALUES
			( concat('tag-', i) )
		ON CONFLICT
			( "name" )
		DO NOTHING;
	END LOOP; -- End Loop: Tags

	-- Set count_tags Variable
	SELECT
		INTO count_tags COUNT(*)
	FROM
		tags;

	-- Loop: Accounts
	FOR i IN 1..count_accounts LOOP
		-- Create Account
		INSERT INTO accounts
			( "username", "password", "email", "email_new", "is_confirmed" )
		VALUES
			(
				concat('user-', i),
				'$2b$10$cUqX9goVOaqqvc8cSlnnQOi/DuIKWvdRlb3EiZCvQGzBJbfSPzQ6K', -- P@ssword
				concat('user-', i, '@email.com'),
				concat('user-', i, '@email.com'),
				TRUE
			)
		RETURNING
			"id" INTO user_id;

		-- Create User
		INSERT INTO users
			( "id", "firstname", "lastname", "birthdate", "gender", "orientation", "location", "biography" )
		VALUES
			(
				user_id,
				concat('fname-', i),
				concat('lname-', i),
				now() - (INTERVAL '18 years') - (random() * (INTERVAL '50 years')),
				('[0:1]={MALE,FEMALE}'::Gender[])[random_int(0, 1)],
				('[0:2]={BISEXUAL,HOMOSEXUAL,HETEROSEXUAL}'::Orientation[])[random_int(0, 2)],
				ST_SetSRID(ST_MakePoint(random_float(-2.0, 7.0), random_float(42.0, 49.0)), 4326),
				concat('User ', i, ' biography...')
			);

		-- Create Picture
		INSERT INTO pictures
			( "id_user", "path" )
		VALUES
			( user_id, concat('https://placehold.co/400x600?text=', gen_random_uuid()::text) )
		RETURNING
			"id" INTO picture_id;

		INSERT INTO pictures
			( "id_user", "path" )
		VALUES
			( user_id, concat('https://placehold.co/400x600?text=', gen_random_uuid()::text) )
		RETURNING
			"id" INTO picture_id;

		-- Update User Profile Picture
		UPDATE users
		SET
			"id_picture" = picture_id
		WHERE
			"id" = user_id;

		-- Loop: User Tags
		FOR t IN
			SELECT "id" FROM tags ORDER BY random() LIMIT random_int(0, 4)
		LOOP
			-- Add Tag to User
			INSERT INTO users_tags
				("id_user", "id_tag")
			VALUES
				(user_id, t.id);
		END LOOP; -- End Loop: User Tags
	END LOOP; -- End Loop: Accounts

	-- Loop: Relations
	FOR u IN
		SELECT "id" FROM users
	LOOP
		-- Loop: Relations Targets
		FOR t IN
			SELECT DISTINCT "id" FROM users TABLESAMPLE SYSTEM(0.5) WHERE "id" != u.id LIMIT random_int(0, 20)
		LOOP
			-- Create Activities
			INSERT INTO activities
				( "id_user_from", "id_user_to", "action", "created_at" )
			VALUES
				(
					u.id,
					t.id,
					'WATCHED_PROFILE',
					now() - (random() * (INTERVAL '1 year'))
				);

			-- Randomize Relations
			IF random() < 0.01 THEN
				-- Create Report
				INSERT INTO reports
					( "id_user_from", "id_user_to", "created_at" )
				VALUES
					( u.id, t.id, now() - (random() * (INTERVAL '1 year')) );
			ELSIF random() < 0.05 THEN
				-- Create Block
				INSERT INTO blocks
					( "id_user_from", "id_user_to", "created_at" )
				VALUES
					( u.id, t.id, now() - (random() * (INTERVAL '1 year')) );
			ELSIF random() < 0.25 THEN
				-- Create bidirectional Like
				INSERT INTO likes
					( "id_user_from", "id_user_to", "created_at" )
				VALUES
					( u.id, t.id, now() - (random() * (INTERVAL '1 year')) ),
					( t.id, u.id, now() - (random() * (INTERVAL '1 year')) )
				ON CONFLICT
					( "id_user_from", "id_user_to" )
				DO NOTHING;
			ELSE
				-- Create unidirectional Like
				INSERT INTO likes
					( "id_user_from", "id_user_to", "created_at" )
				VALUES
					( u.id, t.id, now() - (random() * (INTERVAL '1 year')) )
				ON CONFLICT
					( "id_user_from", "id_user_to" )
				DO NOTHING;
			END IF;
		END LOOP; -- End Loop: Relations Targets
	END LOOP; -- End Loop: Relations
END
$$;
