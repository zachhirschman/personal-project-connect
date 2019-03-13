insert into post_comments(post_comment,post_id,poster_first_name,poster_last_name,poster_picture)
values($1,$2,$3,$4,$5);
select * from post_comments;