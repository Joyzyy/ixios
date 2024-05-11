package routes

import (
	"encoding/json"
	"ixios-server/proto"
	"ixios-server/rest_api/middlewares"
	"net/http"
)

func StatisticsRoutes(router *http.ServeMux, gRPC *proto.StatisticsServiceClient) {
	// This function will contain the logic to handle the simple statistics routes
	simple_statistics := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		statisticalInput := r.Context().Value("statisticalInput").(*proto.StatisticsRequest)

		response, err := (*gRPC).AnalyzeSimpleStatistics(r.Context(), statisticalInput)
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

	advanced_statistics := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		statisticalInput := r.Context().Value("statisticalInput").(*proto.StatisticsRequest)
		res, err := (*gRPC).AnalyzeAdvancedStatistics(r.Context(), statisticalInput)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		jsonResponse, err := json.Marshal(res)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)
	})

	router.Handle(
		"POST /v1/simple_statistics",
		middlewares.Logger(middlewares.ConvertModelToProtoMiddleware(&simple_statistics)),
	)
	router.Handle(
		"POST /v1/advanced_statistics",
		middlewares.Logger(middlewares.ConvertModelToProtoMiddleware(&advanced_statistics)),
	)
}
