package restapi

import (
	"fmt"
	"net/http"

	"github.com/rs/cors"
)

func InitHttpServer(port int) (*http.ServeMux, *http.Server) {
	mux := http.NewServeMux()

	corsHandler := cors.AllowAll().Handler(mux)

	return mux, &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: corsHandler,
	}
}
