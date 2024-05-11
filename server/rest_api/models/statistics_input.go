package models

// SimpleStatisticsInput is the model for the simple statistics input
type StatisticalInputType struct {
	Row    string    `json:"row"`
	Values []float32 `json:"values"`
}

type StatisticalInput struct {
	Data    []StatisticalInputType `json:"data"`
	Methods []string               `json:"methods"`
}
