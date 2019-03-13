insert into users (first_name, last_name,status,profile_picture,department,password,email)
values($1,$2,$3,$4,$5,$6,$7)
returning *;