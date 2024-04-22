package middlewares

import (
	"log"
	"net/http"
)

func Logger(f *http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("recieved request")
		f.ServeHTTP(w, r)
	}
}
