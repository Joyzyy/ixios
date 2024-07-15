package middlewares

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt"
)

func UserAuthenticatedMiddleware(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")

		bearerToken := strings.Split(auth, " ")[1]
		if bearerToken == "undefined" {
			f.ServeHTTP(w, r)
			return
		}

		if bearerToken != "" {
			t, err := jwt.Parse(bearerToken, func(t *jwt.Token) (interface{}, error) {
				return []byte("secret"), nil
			})
			if err != nil {
				log.Println("Could not parse token")
			}

			email := t.Claims.(jwt.MapClaims)["email"]

			if email != "" {
				ctx := context.WithValue(r.Context(), "email", email)
				r = r.WithContext(ctx)
				f.ServeHTTP(w, r)
				return
			}
		}

		f.ServeHTTP(w, r)
	}
}
