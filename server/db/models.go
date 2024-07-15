package db

type User struct {
	Username          string
	Email             string
	Password          string
	OperationsHistory []map[string]interface{}
}
