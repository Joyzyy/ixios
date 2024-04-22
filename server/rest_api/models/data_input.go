package models

type DataInputModel struct {
	Row    string  `json:"row"`
	Values []int64 `json:"values"`
}

type DataInputRequest struct {
	Data []DataInputModel `json:"data"`
}
