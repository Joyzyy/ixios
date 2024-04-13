package main

import (
	"context"
	"fmt"
	pb "ixios-protos"
)

// App struct
type App struct {
	ctx                    context.Context
	basicCalculationClient pb.BasicCalculationClient
}

// NewApp creates a new App application struct
func NewApp(client pb.BasicCalculationClient) *App {
	return &App{
		basicCalculationClient: client,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) Add(in *pb.BCRequest) *pb.BCResponse {
	res, err := a.basicCalculationClient.Add(a.ctx, in)
	if err != nil {
		return &pb.BCResponse{}
	}
	return res
}
