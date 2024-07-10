package routes

import (
	"encoding/json"
	"ixios-server/db"
	"ixios-server/rest_api/models"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
)

func UserRoutes(router *http.ServeMux, rdb *redis.Client) {
	login_route := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var userRequest models.UserLogin

		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		if err := json.NewDecoder(r.Body).Decode(&userRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		userBytes, err := rdb.Get(r.Context(), userRequest.Email).Result()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var user db.User
		err = json.Unmarshal([]byte(userBytes), &user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userRequest.Password))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"email": userRequest.Email,
			"exp":   time.Now().Add(time.Hour * 24).Unix(),
		}).SignedString([]byte("secret"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		jsonToken, _ := json.Marshal(map[string]interface{}{
			"token":    token,
			"username": user.Username,
		})

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonToken)
	})

	register_route := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var userRequest models.UserRegister

		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		if err := json.NewDecoder(r.Body).Decode(&userRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userRequest.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		user := db.User{
			Username:          userRequest.Email,
			Password:          string(hashedPassword),
			OperationsHistory: []map[string]interface{}{},
		}

		userBytes, err := json.Marshal(user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = rdb.Set(r.Context(), userRequest.Email, userBytes, 0).Err()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		token, err := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.MapClaims{
			"email": userRequest.Email,
			"exp":   time.Now().Add(time.Hour * 24).Unix(),
		}).SignedString([]byte("secret"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		tokenBytes, _ := json.Marshal(map[string]interface{}{
			"token":    token,
			"username": userRequest.Username,
		})

		w.WriteHeader(http.StatusCreated)
		w.Header().Set("Content-Type", "application/json")
		w.Write(tokenBytes)
	})

	history_route := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		userRequest := r.Context().Value("userId").(string)

		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(userRequest))
	})

	router.Handle("POST /v1/user/login", login_route)
	router.Handle("POST /v1/user/register", register_route)
	router.Handle("GET /v1/user/history", history_route)
}
