FROM golang:1.22.2
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod tidy
RUN go mod download
COPY . .
WORKDIR /app/cmd
COPY .env .
RUN CGO_ENABLED=0 GOOS=linux go build -v -o ./ixios-server
EXPOSE 8080
CMD ["./ixios-server"]