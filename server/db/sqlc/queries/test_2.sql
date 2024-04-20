-- name: GetTest_2 :one
select * from test_schema_2
where id = $1 limit 1;

-- name: ListTests_2 :many
select * from test_schema_2
order by id;

-- name: CreateTest_2 :one
insert into test_schema_2 (
    free_text_2
) values (
    $1
)
returning *;

-- name: UpdateTest_2 :exec
update test_schema_2
    set free_text_2 = $2
where id = $1;

-- name: DeleteTest_2 :exec
delete from test_schema_2
where id = $1;