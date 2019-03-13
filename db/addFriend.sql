insert into connections (friend_of,first_name,last_name,profile_picture)
values($1,$2,$3,$4)
returning *;