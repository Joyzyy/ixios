package models

import "google.golang.org/protobuf/types/known/structpb"

type TimeSeriesInput struct {
	Data       []StatisticalInputType `json:"data"`
	Methods    []string               `json:"methods"`
	TsSpecific *structpb.Struct       `json:"ts_specific"`
}
