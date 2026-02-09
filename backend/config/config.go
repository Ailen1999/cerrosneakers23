package config

// Config holds application configuration
type Config struct {
	ServerPort string
	DBPath     string
	DebugMode  bool
}

// New creates a new configuration with default values
func New() *Config {
	return &Config{
		ServerPort: ":8080",
		DBPath:     "./catalog.db",
		DebugMode:  true,
	}
}
