package grpc

import (
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func InitGrpcClient() (*grpc.ClientConn, error) {
	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	}

	// mustard on the beat ho

	conn, err := grpc.Dial("joylunow.dev:50051", opts...)
	if err != nil {
		return nil, err
	}

	return conn, nil
}
