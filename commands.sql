CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('testAuthor1', 'something.com/something', 'This is a test 1');
insert into blogs (author, url, title) values ('testAuthor2', 'something.com/something', 'This is a test 2');
