update user_posts
set like_count = $2
where post_id = $1;
select * from user_posts 
order by time_posted desc;
