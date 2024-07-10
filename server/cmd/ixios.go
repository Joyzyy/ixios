package main

import (
	"ixios-server/grpc"
	"ixios-server/proto"
	rest "ixios-server/rest_api"
	"ixios-server/rest_api/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/sashabaranov/go-openai"
)

func main() {
	// load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("encountered error while loading .env: %v", err)
	}
	log.Println("Loaded .env")

	// setup redis client
	// rdb, err := db.InitializeRedisClient()
	// if err != nil {
	// 	log.Fatalf("encountered error while initializing redis client: %v", err)
	// }
	// defer rdb.Close()
	log.Println("Initialized Redis client")

	// setup grpc client
	gRPC, err := grpc.InitGrpcClient()
	if err != nil {
		log.Fatalf("encountered error while initialzing grpc: %v", err)
	}
	defer gRPC.Close()
	log.Println("Initialized gRPC client")
	// setup grpc contract clients
	statisticsGRPC := proto.NewStatisticsServiceClient(gRPC)

	// setup http server
	router, server := rest.InitHttpServer(8080)
	defer server.Close()
	log.Println("Initialized HTTP server")

	// setup chatgpt client
	chatGPTClient := openai.NewClient(os.Getenv("OPENAPI_KEY"))
	log.Println("Initialized OpenAI client")

	// setup routes
	router.HandleFunc("GET /test", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to IXIOS"))
	})
	routes.StatisticsRoutes(router, &statisticsGRPC, nil)
	routes.UserRoutes(router, nil)
	routes.OpenAIRoutes(router, chatGPTClient)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("encountered error while initializing http server: %v", err)
	}
}
