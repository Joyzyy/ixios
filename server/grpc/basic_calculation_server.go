package grpc

import (
	"context"
	pb "ixios-protos"
)

type BasicCalculationServer struct {
	pb.UnimplementedBasicCalculationServer
}

func (*BasicCalculationServer) Add(_ context.Context, in *pb.BCRequest) (*pb.BCResponse, error) {
	var sum int64 = 0
	for _, data := range in.Data {
		for _, val := range data.Values {
			sum += val
		}
	}

	return &pb.BCResponse{
		Result: sum,
	}, nil
}
