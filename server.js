const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let systemState = {
  isLockdown: false,
  threatLevel: "LOW",
  logs: ["[SYSTEM] STRATUM CORE ONLINE"]
};

// Pulse for /app meters
app.get('/api/aa-iu/pulse', (req, res) => {
  res.json({
    status: systemState.isLockdown ? "ISOLATED" : "PROTECTED",
    threat_level: systemState.threatLevel,
    latency: Math.floor(Math.random() * 15) + "ms"
  });
});

// Admin Control for /command
app.post('/api/aa/admin/lockdown', (req, res) => {
  const { status, level } = req.body;
  systemState.isLockdown = status;
  systemState.threatLevel = level || (status ? "CRITICAL" : "LOW");
  systemState.logs.push(`[ADMIN] State change: ${systemState.threatLevel}`);
  res.json({ success: true });
});

app.get('/api/aa/logs', (req, res) => res.json(systemState.logs.reverse()));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Stratum Backend on port ${PORT}`));
