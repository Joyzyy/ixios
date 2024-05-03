package middlewares

import (
	"context"
	"encoding/json"
	"fmt"
	"ixios-server/proto"
	"ixios-server/rest_api/models"
	"net/http"
)

func convertSimpleModelToProto(dataInput models.SimpleStatisticsInputType) *proto.SimpleStatisticsDataType {
	return &proto.SimpleStatisticsDataType{
		Row:    dataInput.Row,
		Values: dataInput.Values,
	}
}

func ConverToProto(statisticalInput interface{}) interface{} {
	switch statisticalInput := statisticalInput.(type) {
	case models.SimpleStatisticsInput:
		data := convertSimpleModelToProto(statisticalInput.Data)
		simpleStatisticsRequest := &proto.SimpleStatisticsRequest{
			Data:    data,
			Methods: statisticalInput.Methods,
		}
		return simpleStatisticsRequest
	}
	return nil
}

func ConverModelToProtoMiddleware[T models.SimpleStatisticsInput | float32](
	f *http.HandlerFunc,
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// This function will contain the logic to convert the model to proto
		var StatisticalInput T

		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		if err := json.NewDecoder(r.Body).Decode(&StatisticalInput); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		convertedData := ConverToProto(StatisticalInput)
		fmt.Println("converted data: ", convertedData)

		ctx := context.WithValue(r.Context(), "StatisticalInput", convertedData)

		r = r.WithContext(ctx)
		f.ServeHTTP(w, r)
	}
}
