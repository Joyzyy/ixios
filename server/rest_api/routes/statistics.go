package routes

import (
	"context"
	"encoding/json"
	"ixios-server/db"
	"ixios-server/proto"
	"ixios-server/rest_api/middlewares"
	"log"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

func StatisticsRoutes(router *http.ServeMux, gRPC *proto.StatisticsServiceClient, rdb *redis.Client) {
	descriptive_statistics := middlewares.UserAuthenticatedMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

		if r.Context().Value("email") != nil {
			email := r.Context().Value("email").(string)
			val, err := rdb.Get(r.Context(), email).Result()
			if err != nil {
				log.Println(err)
			}

			var user db.User
			err = json.Unmarshal([]byte(val), &user)
			if err != nil {
				log.Println(err)
			}

			newOperation := map[string]interface{}{
				"operation": "Descriptive statistics",
				"time":      time.Now().Format(time.RFC1123),
				"json":      string(jsonResponse),
			}

			user.OperationsHistory = append(user.OperationsHistory, newOperation)
			updatedJSON, err := json.Marshal(user)
			if err != nil {
				log.Println(err)
			}

			err = rdb.Set(context.Background(), email, updatedJSON, 0).Err()
			if err != nil {
				log.Println(err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(jsonResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}))

	inferential_statistics := middlewares.UserAuthenticatedMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		statisticalInput := r.Context().Value("inferentialInput").(*proto.InferentialStatisticsRequest)
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

		if r.Context().Value("email") != nil {
			email := r.Context().Value("email").(string)
			val, err := rdb.Get(r.Context(), email).Result()
			if err != nil {
				log.Println(err)
			}

			var user db.User
			err = json.Unmarshal([]byte(val), &user)
			if err != nil {
				log.Println(err)
			}

			newOperation := map[string]interface{}{
				"operation": "Inferential statistics",
				"time":      time.Now().Format(time.RFC1123),
				"json":      string(jsonResponse),
			}

			user.OperationsHistory = append(user.OperationsHistory, newOperation)
			updatedJSON, err := json.Marshal(user)
			if err != nil {
				log.Println(err)
			}

			err = rdb.Set(context.Background(), email, updatedJSON, 0).Err()
			if err != nil {
				log.Println(err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)
	}))

	time_series_analysis := middlewares.UserAuthenticatedMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		timeSeriesInput := r.Context().Value("timeSeriesInput").(*proto.TimeSeriesAnalysisRequest)
		res, err := (*gRPC).AnalyzeTimeSeriesStatistics(r.Context(), timeSeriesInput)
		if err != nil {
			log.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		jsonResponse, err := json.Marshal(res)
		if err != nil {
			log.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if r.Context().Value("email") != nil {
			email := r.Context().Value("email").(string)
			val, err := rdb.Get(r.Context(), email).Result()
			if err != nil {
				log.Println(err)
			}

			var user db.User
			err = json.Unmarshal([]byte(val), &user)
			if err != nil {
				log.Println(err)
			}

			newOperation := map[string]interface{}{
				"operation": "Time series analysis",
				"time":      time.Now().Format(time.RFC1123),
				"json":      string(jsonResponse),
			}

			user.OperationsHistory = append(user.OperationsHistory, newOperation)
			updatedJSON, err := json.Marshal(user)
			if err != nil {
				log.Println(err)
			}

			err = rdb.Set(context.Background(), email, updatedJSON, 0).Err()
			if err != nil {
				log.Println(err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)
	}))

	router.Handle(
		"POST /v1/statistics/descriptive",
		middlewares.Logger(middlewares.ConvertModelToProtoMiddleware(&descriptive_statistics)),
	)

	router.Handle(
		"POST /v1/statistics/time_series",
		middlewares.Logger(middlewares.ConvertModelToProtoTSMiddleware(&time_series_analysis)),
	)

	router.Handle(
		"POST /v1/statistics/inferential",
		middlewares.Logger(middlewares.ConvertModelToProtoIFMiddleware(&inferential_statistics)),
	)
}
