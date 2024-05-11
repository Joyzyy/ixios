package middlewares

import (
	"context"
	"encoding/json"
	"fmt"
	"ixios-server/proto"
	"ixios-server/rest_api/models"
	"net/http"
)

func convertModelToProto(dataInput models.StatisticalInputType) *proto.StatisticsDataType {
	return &proto.StatisticsDataType{
		Row:    dataInput.Row,
		Values: dataInput.Values,
	}
}

func convertToProto(statisticalInput models.StatisticalInput) interface{} {
	var data []*proto.StatisticsDataType

	for _, item := range statisticalInput.Data {
		data = append(data, convertModelToProto(item))
	}

	return &proto.StatisticsRequest{
		Data:    data,
		Methods: statisticalInput.Methods,
	}
}

func ConvertModelToProtoMiddleware(f *http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var statisticalInput models.StatisticalInput

		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		if err := json.NewDecoder(r.Body).Decode(&statisticalInput); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		fmt.Println("statisticalInput http: ", statisticalInput)

		convertedData := convertToProto(statisticalInput)
		ctx := context.WithValue(r.Context(), "statisticalInput", convertedData)

		r = r.WithContext(ctx)
		f.ServeHTTP(w, r)
	}
}
