package db

import (
	"context"
	"fmt"
	sqlcdb "ixios-server/db/sqlc"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func LoadDbUrl() string {
	var (
		host     = os.Getenv("DB_HOST")
		port, _  = strconv.Atoi(os.Getenv("DB_PORT"))
		user     = os.Getenv("DB_USER")
		password = os.Getenv("DB_PASS")
		name     = os.Getenv("DB_NAME")
		url      = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, name)
	)

	return url
}

func InitDatabaseConnection() (*pgxpool.Pool, error) {
	url := LoadDbUrl()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	conn, err := pgxpool.New(ctx, url)
	if err != nil {
		return nil, err
	}

	return conn, nil
}

func InitDatabase(conn *pgxpool.Pool) *sqlcdb.Queries {
	return sqlcdb.New(conn)
}
