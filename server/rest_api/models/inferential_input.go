package models

import "google.golang.org/protobuf/types/known/structpb"

type InferentialInput struct {
	Data       []StatisticalInputType `json:"data"`
	Methods    []string               `json:"methods"`
	IfSpecific *structpb.Struct       `json:"if_specific"`
}
