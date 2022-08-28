
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    uid		    SERIAL PRIMARY KEY ,
    name		TEXT NOT NULL UNIQUE,
    password	TEXT,
    token	TEXT,
    refresh_token TEXT,
    verified BOOLEAN,
    email TEXT,
    profile_pic_url TEXT,
    dob TEXT
);

