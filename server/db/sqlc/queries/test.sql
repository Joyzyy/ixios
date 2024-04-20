-- name: GetTest :one
select * from test_schema
where id = $1 limit 1;

-- name: ListTests :many
select * from test_schema
order by id;

-- name: CreateTest :one
insert into test_schema (
    free_text
) values (
    $1
)
returning *;

-- name: UpdateTest :exec
update test_schema
    set free_text = $2
where id = $1;

-- name: DeleteTest :exec
delete from test_schema
where id = $1;