package models

// SimpleStatisticsInput is the model for the simple statistics input
type SimpleStatisticsInputType struct {
	Row    string    `json:"row"`
	Values []float32 `json:"values"`
}

type SimpleStatisticsInput struct {
	Data    SimpleStatisticsInputType `json:"data"`
	Methods []string                  `json:"methods"`
}
