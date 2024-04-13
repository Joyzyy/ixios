package main

import (
	"embed"
	pb "ixios-protos"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

type GrpcClient struct {
	Conn *grpc.ClientConn
}

func InitGrpcClient() (*GrpcClient, error) {
	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	}

	conn, err := grpc.NewClient("localhost:8080", opts...)
	if err != nil {
		return nil, err
	}

	return &GrpcClient{conn}, nil
}

func main() {
	grpcClient, err := InitGrpcClient()
	if err != nil {
		panic("couldnt establish grpc connection")
	}
	defer func(Conn *grpc.ClientConn) {
		err = Conn.Close()
		if err != nil {
			panic("could not close grpc connection")
		}
	}(grpcClient.Conn)

	basicCalculationClient := pb.NewBasicCalculationClient(grpcClient.Conn)

	// Create an instance of the app structure
	app := NewApp(basicCalculationClient)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "IXIOS",
		Width:  1280,
		Height: 720,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
