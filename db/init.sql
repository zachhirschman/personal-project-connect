drop table if exists users;


create table users(
user_id serial primary key
,first_name varchar(64)
,last_name varchar(64)
,status text
,profile_picture text
,department varchar(64)
,messages text []);



--Thursday March 7th working on storing messages
create table rooms(
user_1 integer
,user_2 integer
,room_name varchar(64) primary key);


--Room data
create table room_data(
time_sent TIMESTAMPTZ NOT NULL DEFAULT NOW()
,sender integer
,recipient integer
,message text
,room_name varchar(64) references rooms(room_name)
);

--create table rooms(
-- user_1 integer
-- ,user_2 integer
-- ,room_name varchar(64) primary key);

-- create table room_data(
-- time_sent TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- ,sender integer
-- ,recipient integer
-- ,message text
-- ,room_name varchar(64) references rooms(room_name)
-- );

-- insert into rooms (user_1,user_2,room_name)
-- values (1,2,'x5y'),(5,3,'4@1');

-- insert into room_data (room_name,sender,recipient,message)
-- values('x5y',1,2,'Hey'),('4@1',3,5,'oy'),('x5y',2,1,'Hey man whats up');

-- select * from room_data
-- join rooms on(room_data.room_name = rooms.room_name)
-- where rooms.room_name = 'x5y';

--Saturday March 9th adding friends table
create table connections(
friend_of integer references users(user_id),
first_name text,
last_name text,
profile_picture text);

create table user_posts(
post_id serial primary key
,poster integer references users(user_id)
,post_text text
,post_img text);

create table post_comments(
comment_id serial primary key
,post_comment text
,post_id integer references user_posts(post_id)
,poster integer references users(user_id));


create table likes(
post_id integer references user_posts(post_id)
,liked_by_first text);