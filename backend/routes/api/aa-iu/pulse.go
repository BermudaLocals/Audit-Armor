package aaiu

import (
	"net/http"
	"time"
	"math/rand"
	"github.com/gin-gonic/gin"
)

type PulseResponse struct {
	Timestamp    string   `json:"timestamp"`
	Status       string   `json:"status"`
	AA1Exposure  int      `json:"aa1_exposure"`
	AA2Exposure  int      `json:"aa2_exposure"`
	Jurisdictions []string `json:"jurisdictions"`
}

// GetPulse returns current system pulse with live exposure metrics
func GetPulse(c *gin.Context) {
	// Simulate live detection metrics with slight randomness
	rand.Seed(time.Now().UnixNano())
	
	aa1 := 45 + rand.Intn(35)  // 45-80% range
	aa2 := 25 + rand.Intn(30)  // 25-55% range
	
	status := "online"
	if aa1 > 70 || aa2 > 50 {
		status = "alert"
	} else if aa1 > 50 || aa2 > 40 {
		status = "detecting"
	}

	response := PulseResponse{
		Timestamp:     time.Now().UTC().Format(time.RFC3339),
		Status:        status,
		AA1Exposure:   aa1,
		AA2Exposure:   aa2,
		Jurisdictions: []string{"AA1", "AA2"},
	}

	c.JSON(http.StatusOK, response)
}

// RegisterPulseRoutes sets up pulse endpoint
func RegisterPulseRoutes(router *gin.Engine) {
	router.GET("/api/aa-iu/pulse", GetPulse)
}
