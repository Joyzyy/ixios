package main

import (
	"context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	pb "ixios-protos"
	"log"
	"net"
)

type server struct {
	pb.UnimplementedBasicCalculationServer
}

func (_ *server) Add(_ context.Context, in *pb.BCRequest) (*pb.BCResponse, error) {
	var sum int64 = 0
	for _, data := range in.Data {
		for _, val := range data.Values {
			sum += val
		}
	}
	return &pb.BCResponse{Result: sum}, nil
}

func main() {
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	reflection.Register(s)

	pb.RegisterBasicCalculationServer(s, &server{})
	if err = s.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
