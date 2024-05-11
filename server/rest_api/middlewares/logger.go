package middlewares

import (
	"log"
	"net/http"
)

func Logger(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("recieved %v request on %v\n", r.Method, r.URL.Path)
		f.ServeHTTP(w, r)
	}
}
