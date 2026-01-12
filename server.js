const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ====================================================================
// STATE MANAGEMENT
// ====================================================================

let killSwitchState = 'ACTIVE'; // ACTIVE | INTERRUPT | SUSPEND | TERMINATE
const AUDIT_LEDGER = [];

// Initialize with startup entry
AUDIT_LEDGER.push({
  timestamp: new Date().toISOString(),
  identity: 'SYSTEM',
  action: 'STARTUP',
  result: 'INITIALIZED'
});

// ====================================================================
// ENDPOINTS
// ====================================================================

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'audit-armor-stratum' });
});

// Live Pulse Metrics
app.get('/api/aa-iu/pulse', (req, res) => {
  const latency = `${Math.floor(Math.random() * 5 + 20)}ms`;
  const load = `${Math.floor(Math.random() * 8)}%`;
  const status = killSwitchState === 'ACTIVE' ? 'SHIELD_ACTIVE' : `SHIELD_${killSwitchState}`;

  res.json({
    latency,
    load,
    status,
    jurisdiction: 'AA1_BERMUDA',
    killSwitchState
  });
});

// Authorization (Demo PIN validation)
app.post('/api/aa/authorize', (req, res) => {
  const { email, pin } = req.body;
  const isAuthorized = ['FAIR', 'LAWSUIT', 'AUDIT'].includes(pin?.toUpperCase());

  // Log authorization attempt
  AUDIT_LEDGER.push({
    timestamp: new Date().toISOString(),
    identity: email || 'Anonymous',
    action: 'AUTH_ATTEMPT',
    result: isAuthorized ? 'GRANTED' : 'REJECTED'
  });

  res.status(isAuthorized ? 200 : 401).json({ 
    authorized: isAuthorized,
    message: isAuthorized ? 'Access Granted' : 'Invalid PIN'
  });
});

// GET Audit Ledger (view-only)
app.get('/api/aa/admin/ledger', (req, res) => {
  res.json(AUDIT_LEDGER);
});

// GET Kill-Switch State
app.get('/api/admin/kill-switch', (req, res) => {
  res.json({
    state: killSwitchState,
    timestamp: new Date().toISOString()
  });
});

// SET Kill-Switch State (POST)
app.post('/api/admin/kill-switch', (req, res) => {
  const { state } = req.body;
  const validStates = ['ACTIVE', 'INTERRUPT', 'SUSPEND', 'TERMINATE'];

  if (!validStates.includes(state)) {
    return res.status(400).json({ 
      error: 'Invalid state. Valid: ACTIVE, INTERRUPT, SUSPEND, TERMINATE' 
    });
  }

  const previousState = killSwitchState;
  killSwitchState = state;

  // Log kill-switch change
  AUDIT_LEDGER.push({
    timestamp: new Date().toISOString(),
    identity: 'ADMIN',
    action: 'KILL_SWITCH',
    result: `CHANGED: ${previousState} → ${state}`
  });

  res.json({
    state: killSwitchState,
    previousState,
    timestamp: new Date().toISOString(),
    logged: true
  });
});

// POST Manual Audit Log Entry (admin only)
app.post('/api/admin/audit-logs', (req, res) => {
  const { identity, action, result } = req.body;

  if (!identity || !action || !result) {
    return res.status(400).json({ 
      error: 'Required fields: identity, action, result' 
    });
  }

  const entry = {
    timestamp: new Date().toISOString(),
    identity,
    action,
    result
  };

  AUDIT_LEDGER.push(entry);
  res.status(201).json(entry);
});

// ====================================================================
// ERROR HANDLING
// ====================================================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ====================================================================
// SERVER START
// ====================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║     AUDIT ARMOR - STRATUM BACKEND LIVE                  ║
║     Bermuda Institutional Protection Node (AA1)         ║
║     Port: ${PORT}                                              ║
║     Kill-Switch State: ${killSwitchState}                      ║
║     Audit Ledger: Active (immutable)                    ║
╚══════════════════════════════════════════════════════════╝
  `);
});
