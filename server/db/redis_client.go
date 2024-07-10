package db

import (
	"github.com/redis/go-redis/v9"
)

func InitializeRedisClient() (*redis.Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr: "0.0.0.0:6379",
		DB:   0,
	})
	return rdb, nil
}
