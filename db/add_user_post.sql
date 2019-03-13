insert into user_posts(poster_first_name,poster_last_name,poster_picture,post_text,post_img,like_count)
values($1,$2,$3,$4,$5,0);
select * from user_posts
order by time_posted desc;