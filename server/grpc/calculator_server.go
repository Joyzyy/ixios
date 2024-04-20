package grpc

import (
	"context"
	pb "ixios-protos"
)

type CalculatorServer struct {
	pb.UnimplementedCalculatorServer
}

func (*CalculatorServer) Subtract(_ context.Context, in *pb.CalculatorRequest) (*pb.CalculatorResponse, error) {
	return &pb.CalculatorResponse{
		Res: in.A - in.B,
	}, nil
}
