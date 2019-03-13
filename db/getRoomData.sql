select * from room_data
join rooms on(room_data.room_name = rooms.room_name)
where rooms.room_name = $1
order by time_sent asc;