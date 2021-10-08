-- create db
DROP DATABASE IF EXISTS sdcdb;

CREATE DATABASE sdcdb;

-- connect to db
\c sdcdb;

/*
-- create role
DROP ROLE api;
CREATE ROLE api LOGIN PASSWORD 'pw';
*/

-- create tables:
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  reported INT NOT NULL DEFAULT 0,
  helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  reported INT NOT NULL DEFAULT 0,
  helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url TEXT NOT NULL
);

-- prep tables for faster load
ALTER TABLE questions SET UNLOGGED;
ALTER TABLE answers SET UNLOGGED;
ALTER TABLE photos SET UNLOGGED;
ALTER TABLE questions DISABLE TRIGGER ALL;
ALTER TABLE answers DISABLE TRIGGER ALL;
ALTER TABLE photos DISABLE TRIGGER ALL;

-- load from CSV file
COPY questions FROM '/Users/huongnguyen/HackReactor/senior/SDC-data/questions.csv' DELIMITER ',' CSV HEADER;
COPY answers FROM '/Users/huongnguyen/HackReactor/senior/SDC-data/answers.csv' DELIMITER ',' CSV HEADER;
COPY photos FROM '/Users/huongnguyen/HackReactor/senior/SDC-data/answers_photos.csv' DELIMITER ',' CSV HEADER;

-- undo prep
ALTER TABLE questions SET LOGGED;
ALTER TABLE answers SET LOGGED;
ALTER TABLE photos SET LOGGED;

ALTER TABLE questions ENABLE TRIGGER ALL;
ALTER TABLE answers ENABLE TRIGGER ALL;
ALTER TABLE photos ENABLE TRIGGER ALL;

-- grant api permission to access table
GRANT ALL ON questions TO api;
GRANT ALL ON answers TO api;
GRANT ALL ON photos TO api;

-- create index & foreign keys
CREATE INDEX idx_product_id ON questions (product_id);
CREATE INDEX idx_question_id ON answers (question_id);
CREATE INDEX idx_answer_id ON photos (answer_id);

ALTER TABLE answers ADD CONSTRAINT fk_question_id FOREIGN KEY (question_id) REFERENCES questions (id);
ALTER TABLE photos ADD CONSTRAINT fk_answer_id FOREIGN KEY (answer_id) REFERENCES answers (id);

/*  Execute this file from the command line by typing:
 *  psql -d <dbname> -a -f <pathToThisFile>
 OR
 *  sudo -u postgres psql < scripts/seed.sql
 *  to create the database and the tables.*/

