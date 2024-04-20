package grpc

import (
	pb "ixios-protos"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func InitializeGRPC() *grpc.Server {
	s := grpc.NewServer()
	reflection.Register(s)

	pb.RegisterBasicCalculationServer(s, &BasicCalculationServer{})
	pb.RegisterCalculatorServer(s, &CalculatorServer{})

	return s
}
