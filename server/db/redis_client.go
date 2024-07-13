package db

import (
	"crypto/tls"

	"github.com/redis/go-redis/v9"
)

func InitializeRedisClient() (*redis.Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr: "joylunow.dev:6379",
		TLSConfig: &tls.Config{
			MinVersion: tls.VersionTLS12,
			ServerName: "joylunow.dev",
		},
		DB: 0,
	})
	return rdb, nil
}
