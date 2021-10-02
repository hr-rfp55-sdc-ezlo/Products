-- connect to db
\c sdcdb;

-- convert data in data_written column from unix epoch to timestamp
ALTER TABLE questions ALTER COLUMN date_written SET DATA TYPE timestamp with time zone USING to_timestamp(date_written / 1000);

ALTER TABLE answers ALTER COLUMN date_written SET DATA TYPE timestamp with time zone USING to_timestamp(date_written / 1000);

-- set default for date_written to auto-populate date upon insertion
ALTER TABLE questions ALTER COLUMN date_written SET DEFAULT CURRENT_TIMESTAMP(0);

ALTER TABLE answers ALTER COLUMN date_written SET DEFAULT CURRENT_TIMESTAMP(0);

-- convert reported column from int to boolean (0 = FALSE & 1 = TRUE) and set default to FALSE
ALTER TABLE questions ALTER COLUMN reported DROP DEFAULT;
ALTER TABLE questions ALTER reported TYPE bool USING CASE WHEN reported=0 THEN FALSE ELSE TRUE END;
ALTER TABLE questions ALTER COLUMN reported SET DEFAULT FALSE;

ALTER TABLE answers ALTER COLUMN reported DROP DEFAULT;
ALTER TABLE answers ALTER reported TYPE bool USING CASE WHEN reported=0 THEN FALSE ELSE TRUE END;
ALTER TABLE answers ALTER COLUMN reported SET DEFAULT FALSE;

-- rename columns to align with old Atelier API
ALTER TABLE questions RENAME COLUMN id TO question_id;
ALTER TABLE questions RENAME COLUMN body TO question_body;
ALTER TABLE questions RENAME COLUMN date_written TO question_date;
ALTER TABLE questions RENAME COLUMN helpful TO question_helpfulness;

ALTER TABLE answers RENAME COLUMN date_written TO date;
ALTER TABLE answers RENAME COLUMN helpful TO helpfulness;

-- reset the id sequence
SELECT setval(pg_get_serial_sequence('photos', 'id'), coalesce(max(id),0) + 1, false) FROM photos;
SELECT setval(pg_get_serial_sequence('answers', 'id'), coalesce(max(id),0) + 1, false) FROM answers;
SELECT setval(pg_get_serial_sequence('questions', 'question_id'), coalesce(max(question_id),0) + 1, false) FROM questions;