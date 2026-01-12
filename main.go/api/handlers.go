// Auth Payload
type AuthRequest struct {
    Email string `json:"email"`
    Pin   string `json:"pin"`
}

// 1. Authorize (JSON Support)
func HandleAuthorize(c *gin.Context) {
    var req AuthRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Invalid request"})
        return
    }
    
    pins := os.Getenv("VALID_DEMO_PINS") // "FAIR,LAWSUIT,AUDIT"
    if strings.Contains(pins, strings.ToUpper(req.Pin)) {
        c.JSON(200, gin.H{"status": "authorized", "jurisdiction": "AA1"})
        return
    }
    c.JSON(401, gin.H{"status": "denied"})
}

// 2. Pulse Endpoint
func HandlePulse(c *gin.Context) {
    c.JSON(200, gin.H{
        "status": "Active",
        "latency": "22ms",
        "load": "14%",
        "jurisdictions": []string{"Bermuda (AA1)", "Cayman (AA2)"},
    })
}

// 3. Admin Kill Switch (Non-deletable log concept)
func HandleKillSwitch(c *gin.Context) {
    state := c.Param("state") // Interrupt, Suspend, Terminate
    log.Printf("[AUDIT_LEDGER] ACTION: KillSwitchUpdate | STATE: %s | TIMESTAMP: %v", state, time.Now())
    c.JSON(200, gin.H{"ledger_updated": true, "new_state": state})
}
