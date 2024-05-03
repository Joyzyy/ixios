package routes

import (
	"encoding/json"
	"ixios-server/proto"
	"ixios-server/rest_api/middlewares"
	"ixios-server/rest_api/models"
	"net/http"
)

func SimpleStatisticsRoutes(router *http.ServeMux, gRPC *proto.SimpleStatisticsAnalysisClient) {
	// This function will contain the logic to handle the simple statistics routes
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		statisticalInput := r.Context().Value("StatisticalInput").(*proto.SimpleStatisticsRequest)

		response, err := (*gRPC).SimpleStatistics(r.Context(), statisticalInput)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// encode the response in json format
		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(jsonResponse)
	})

	router.Handle(
		"POST /v1/simple_statistics",
		middlewares.ConverModelToProtoMiddleware[models.SimpleStatisticsInput](&handler),
	)
}
