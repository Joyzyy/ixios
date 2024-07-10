package db

type User struct {
	Username          string
	Password          string
	OperationsHistory []map[string]interface{}
}
