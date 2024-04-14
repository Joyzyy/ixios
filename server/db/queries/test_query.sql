-- name: GetTest :one
SELECT * FROM SQLCTest
WHERE id = $1 LIMIT 1;

-- name: ListTests :many
SELECT * FROM SQLCTest;

-- name: CreateTest :one
INSERT INTO SQLCTest(
    free_text
) VALUES (
    $1
)
RETURNING *;

-- name: UpdateTest :exec
UPDATE SQLCTest
    SET free_text = $2
WHERE id = $1;

-- name: DeleteTest :exec
DELETE FROM SQLCTest
WHERE id = $1;