package routes

import (
	"encoding/json"
	"ixios-server/rest_api/models"
	"net/http"

	"github.com/sashabaranov/go-openai"
)

func OpenAIRoutes(router *http.ServeMux, gptClient *openai.Client) {
	call_route := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == nil {
			http.Error(w, "empty request body", http.StatusBadRequest)
			return
		}

		var openAIRequest models.OpenAIRequest
		if err := json.NewDecoder(r.Body).Decode(&openAIRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// transform to openai.ChatCompletionRequest
		ccr := []openai.ChatCompletionMessage{}
		for _, message := range openAIRequest.Messages {
			ccr = append(ccr, openai.ChatCompletionMessage{
				Role:    message.Role,
				Content: message.Content,
			})
		}

		resp, err := gptClient.CreateChatCompletion(
			r.Context(),
			openai.ChatCompletionRequest{
				Model:    openAIRequest.Model,
				Messages: ccr,
			},
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		chat_response := resp.Choices[0].Message.Content

		// Return response
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		var response = struct {
			Response string `json:"response"`
		}{Response: chat_response}
		encoded, _ := json.Marshal(response)
		w.Write(encoded)
	})

	router.Handle("POST /v1/openai", call_route)
}
