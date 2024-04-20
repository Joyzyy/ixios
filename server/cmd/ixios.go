package main

import (
	"fmt"
	"ixios-server/db"
	"ixios-server/grpc"
	"log"
	"net"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("encountered error while loading .env: %v", err)
	}

	dbConn, err := db.InitDatabaseConnection()
	if err != nil {
		log.Fatalf("encountered error while initializing db: %v", err)
	}
	defer dbConn.Close()

	grpcServer := grpc.InitializeGRPC()
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("encountered error while initalizing tcp: %v", err)
	}
	defer grpcServer.Stop()
	defer listener.Close()

	log.Println("Starting gRPC server on port 8080!")
	_ = db.InitDatabase(dbConn)
	fmt.Printf("salut!")

	if err = grpcServer.Serve(listener); err != nil {
		log.Fatalf("encountered error while serving grpc server: %v", err)
	}
}
