package grpc

import (
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func InitGrpcClient() (*grpc.ClientConn, error) {
	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	}

	conn, err := grpc.NewClient("127.0.0.1:50051", opts...)
	if err != nil {
		return nil, err
	}

	return conn, nil
}
