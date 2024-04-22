package restapi

import (
	"fmt"
	"net/http"

	"github.com/rs/cors"
)

func InitHttpServer(port int) (*http.ServeMux, *http.Server) {
	mux := http.NewServeMux()

	cors := cors.Default().Handler(mux)

	return mux, &http.Server{
		Addr:    fmt.Sprintf("localhost:%d", port),
		Handler: cors,
	}
}
