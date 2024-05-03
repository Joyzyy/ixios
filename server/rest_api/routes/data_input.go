package routes

import (
	"net/http"
	"google.golang.org/grpc"
)

// func convertModelToProto(dataInput models.DataInputModel) *pb.DataInputType {
// 	return &pb.DataInputType{
// 		Row:    dataInput.Row,
// 		Values: dataInput.Values,
// 	}
// }

func DataInputRoutes(router *http.ServeMux, gRPC *grpc.ClientConn) {
	// handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	var DataInputType models.DataInputRequest

	// 	if r.Body == nil {
	// 		http.Error(w, "empty request body", http.StatusBadRequest)
	// 		return
	// 	}

	// 	if err := json.NewDecoder(r.Body).Decode(&DataInputType); err != nil {
	// 		http.Error(w, err.Error(), http.StatusBadRequest)
	// 		return
	// 	}

	// 	pbs := pb.NewBasicCalculationClient(gRPC)
	// 	data := make([]*pb.DataInputType, len(DataInputType.Data))
	// 	for i, model := range DataInputType.Data {
	// 		data[i] = convertModelToProto(model)
	// 	}
	// 	ps := &pb.BCRequest{
	// 		Data: data,
	// 	}
	// 	val, err := pbs.Add(context.Background(), ps)
	// 	if err != nil {
	// 		log.Fatalf("err: %v", err)
	// 	}

	// 	w.WriteHeader(http.StatusOK)
	// 	w.Write([]byte(val.String()))
	// })

	// router.Handle("POST /v1/data_input", middlewares.Logger(&handler))
}
