// Add these to your Express server
app.use(express.json());

let isLockdown = false;
let auditLogs = ["[SYSTEM] Audit Armor Cold Boot Success"];

app.get('/api/aa-iu/pulse', (req, res) => {
  res.json({ 
    status: isLockdown ? "LOCKDOWN" : "PROTECTED",
    latency: Math.floor(Math.random() * 20) + "ms",
    threat_level: isLockdown ? "CRITICAL" : "LOW"
  });
});

app.post('/api/aa/authorize', (req, res) => {
  const { email, pin } = req.body;
  const validPins = ["FAIR", "LAWSUIT", "AUDIT"];
  if(validPins.includes(pin?.toUpperCase())) {
    res.json({ success: true, token: "AA-JWT-DEMO-2026" });
  } else {
    res.status(401).json({ success: false });
  }
});

app.post('/api/aa/admin/lockdown', (req, res) => {
  isLockdown = req.body.status;
  auditLogs.push(`[ADMIN] Lockdown state toggled to: ${isLockdown}`);
  res.json({ success: true });
});

app.get('/api/aa/admin/logs', (req, res) => res.json(auditLogs));
