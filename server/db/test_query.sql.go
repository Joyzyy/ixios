// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: test_query.sql

package sqlc_db

import (
	"context"
)

const createTest = `-- name: CreateTest :one
INSERT INTO SQLCTest(
    free_text
) VALUES (
    $1
)
RETURNING id, free_text
`

func (q *Queries) CreateTest(ctx context.Context, freeText string) (Sqlctest, error) {
	row := q.db.QueryRow(ctx, createTest, freeText)
	var i Sqlctest
	err := row.Scan(&i.ID, &i.FreeText)
	return i, err
}

const deleteTest = `-- name: DeleteTest :exec
DELETE FROM SQLCTest
WHERE id = $1
`

func (q *Queries) DeleteTest(ctx context.Context, id int64) error {
	_, err := q.db.Exec(ctx, deleteTest, id)
	return err
}

const getTest = `-- name: GetTest :one
SELECT id, free_text FROM SQLCTest
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetTest(ctx context.Context, id int64) (Sqlctest, error) {
	row := q.db.QueryRow(ctx, getTest, id)
	var i Sqlctest
	err := row.Scan(&i.ID, &i.FreeText)
	return i, err
}

const listTests = `-- name: ListTests :many
SELECT id, free_text FROM SQLCTest
`

func (q *Queries) ListTests(ctx context.Context) ([]Sqlctest, error) {
	rows, err := q.db.Query(ctx, listTests)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Sqlctest
	for rows.Next() {
		var i Sqlctest
		if err := rows.Scan(&i.ID, &i.FreeText); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateTest = `-- name: UpdateTest :exec
UPDATE SQLCTest
    SET free_text = $2
WHERE id = $1
`

type UpdateTestParams struct {
	ID       int64
	FreeText string
}

func (q *Queries) UpdateTest(ctx context.Context, arg UpdateTestParams) error {
	_, err := q.db.Exec(ctx, updateTest, arg.ID, arg.FreeText)
	return err
}
