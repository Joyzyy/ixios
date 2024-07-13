package db

import (
	"github.com/redis/go-redis/v9"
)

func InitializeRedisClient() (*redis.Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr: "redis_db",
		DB:   0,
	})
	return rdb, nil
}
