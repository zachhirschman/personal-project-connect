update users
set status = $1
where email = $2
returning status;