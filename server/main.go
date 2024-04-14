package main

import (
	"context"
	"fmt"
	pb "ixios-protos"
	sqlc_db "ixios-server/db"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type server struct {
	pb.UnimplementedBasicCalculationServer
}

func (_ *server) Add(_ context.Context, in *pb.BCRequest) (*pb.BCResponse, error) {
	var sum int64 = 0
	for _, data := range in.Data {
		for _, val := range data.Values {
			sum += val
		}
	}
	return &pb.BCResponse{Result: sum}, nil
}

const (
	host     = "139.162.175.142"
	port     = 5432
	user     = "postgres"
	password = "fotbalPES"
	dbname   = "ixios_main_db"
)

func createRandomTest(queries *sqlc_db.Queries, wg *sync.WaitGroup, i int) {
	defer wg.Done()
	time.Sleep(100 * time.Millisecond)
	fmt.Printf("working on: %d\n", i)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	_, err := queries.CreateTest(ctx, fmt.Sprintf("ixios-%s", uuid.NewString()))
	if err != nil {
		panic(err)
	}
}

func main() {
	// listener, err := net.Listen("tcp", ":8080")
	// if err != nil {
	// 	log.Fatalf("failed to listen: %v", err)
	// }

	// s := grpc.NewServer()
	// reflection.Register(s)

	// pb.RegisterBasicCalculationServer(s, &server{})
	// if err = s.Serve(listener); err != nil {
	// 	log.Fatalf("failed to serve: %v", err)
	// }

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	conn, err := pgxpool.New(ctx, fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname))
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	q := sqlc_db.New(conn)

	t := time.Now()
	var wg sync.WaitGroup
	for i := range 10 {
		wg.Add(1)
		go createRandomTest(q, &wg, i)
	}
	wg.Wait()

	fmt.Printf("took: %v\n", time.Since(t))

	// get list
	vals, err := q.ListTests(context.Background())
	if err != nil {
		panic(err)
	}

	fmt.Println("Values: ", vals)
}
