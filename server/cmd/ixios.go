package main

import (
	"ixios-server/db"
	"ixios-server/grpc"
	"ixios-server/proto"
	rest "ixios-server/rest_api"
	"ixios-server/rest_api/routes"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	// load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("encountered error while loading .env: %v", err)
	}
	log.Println("Loaded .env")

	// setup database connection
	dbConn, err := db.InitDatabaseConnection()
	if err != nil {
		log.Fatalf("encountered error while initializing db: %v", err)
	}
	defer dbConn.Close()
	log.Println("Connected to database")

	_ = db.InitDatabase(dbConn)

	// setup grpc client
	gRPC, err := grpc.InitGrpcClient()
	if err != nil {
		log.Fatalf("encountered error while initialzing grpc: %v", err)
	}
	defer gRPC.Close()
	log.Println("Initialized gRPC client")

	// setup grpc contract clients
	simpleStatisticsGRPC := proto.NewSimpleStatisticsAnalysisClient(gRPC)

	// setup http server
	router, server := rest.InitHttpServer(8080)
	defer server.Close()
	log.Println("Initialized HTTP server")

	// setup routes
	routes.DataInputRoutes(router, gRPC)
	routes.SimpleStatisticsRoutes(router, &simpleStatisticsGRPC)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("encountered error while initializing http server: %v", err)
	}
}
