package routes

import (
	"encoding/json"
	"ixios-server/proto"
	"ixios-server/rest_api/middlewares"
	"net/http"

	"github.com/redis/go-redis/v9"
)

func StatisticsRoutes(router *http.ServeMux, gRPC *proto.StatisticsServiceClient, rdb *redis.Client) {
	descriptive_statistics := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		statisticalInput := r.Context().Value("statisticalInput").(*proto.StatisticsRequest)

		response, err := (*gRPC).AnalyzeDescriptiveStatistics(r.Context(), statisticalInput)
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
		_, err = w.Write(jsonResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	inferential_statistics := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		statisticalInput := r.Context().Value("statisticalInput").(*proto.StatisticsRequest)
		res, err := (*gRPC).AnalyzeInferentialStatistics(r.Context(), statisticalInput)
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
		"POST /v1/statistics/descriptive",
		middlewares.Logger(middlewares.ConvertModelToProtoMiddleware(&descriptive_statistics)),
	)

	router.Handle(
		"POST /v1/statistics/inferential",
		middlewares.Logger(middlewares.ConvertModelToProtoMiddleware(&inferential_statistics)),
	)
}
