# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install necessary build tools (if any)
# RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod ./
# COPY go.sum ./

# Set GOTOOLCHAIN to auto to allow downloading Go 1.24
ENV GOTOOLCHAIN=auto

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main main.go

# Production stage
FROM alpine:latest

WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/main .
# Note: copying catalog.db might overwrite data if volume is not used correctly. 
# Better to let the app create it if it doesn't exist, or use a volume.
# For simplicity in this demo, we assume the app creates it.

# Copy uploads folder if needed
RUN mkdir uploads

# Update config to bind to 0.0.0.0 instead of localhost/127.0.0.1 if hardcoded
# Env vars should handle this

EXPOSE 8080

CMD ["./main"]
