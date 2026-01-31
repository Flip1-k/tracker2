// server.js - Fox Eye Security Tracker Server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins in production (adjust as needed)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (use Redis/MongoDB in production)
let guardLocations = {};

// Your employee database (in production, use MongoDB/PostgreSQL)
const guardDatabase = {
    // Format: EMP001: { name: "Full Name", pin: "1234", role: "Night Guard", status: "Active" }
    "EMP001": { name: "Muhammed Kabia", pin: "1001", role: "Night Guard", status: "Active" },
    "EMP002": { name: "Paschal Anike", pin: "1002", role: "Night Site Supervisor", status: "Active" },
    "EMP003": { name: "Chibuikem", pin: "1003", role: "Night Guard", status: "Active" },
    "EMP004": { name: "Ebraham Lucky Andrews", pin: "1004", role: "Night Guard", status: "Active" },
    "EMP005": { name: "Osman Trawally", pin: "1005", role: "Site Supervisor", status: "Active" },
    "EMP006": { name: "Ibrahim Bangura", pin: "1006", role: "Site Supervisor", status: "Active" },
    "EMP007": { name: "Andrew foday Dumbuya", pin: "1007", role: "Night Guard", status: "Active" },
    "EMP008": { name: "Richard Odezulu", pin: "1008", role: "Day Guard", status: "Active" },
    "EMP009": { name: "Lamin Baldeh", pin: "1009", role: "Day Guard", status: "Active" },
    "EMP010": { name: "Muhammed Krubally", pin: "1010", role: "Day Guard", status: "Active" },
    "EMP011": { name: "John-Bosco", pin: "1011", role: "Site Supervisor", status: "Active" },
    "EMP012": { name: "Muideen Kamara", pin: "1012", role: "Night Guard", status: "Active" },
    "EMP013": { name: "Okonkwo", pin: "1013", role: "Day Guard", status: "Active" },
    "EMP014": { name: "Ismail Tamba", pin: "1014", role: "Day Guard", status: "Active" },
    "EMP015": { name: "Yaya Jallow", pin: "1015", role: "Day Guard", status: "Active" },
    "EMP016": { name: "Abdoulie Tanji", pin: "1016", role: "Night Guard", status: "Active" },
    "EMP017": { name: "Alagie Kargbo", pin: "1017", role: "Night Guard", status: "Active" },
    "EMP018": { name: "Abdullah Kamara", pin: "1018", role: "Day Guard", status: "Active" },
    "EMP019": { name: "Hasim Bojang", pin: "1019", role: "Site Supervisor", status: "Active" },
    "EMP020": { name: "Karamo", pin: "1020", role: "Night Guard", status: "Active" },
    "EMP021": { name: "Hector Pendema", pin: "1021", role: "Night Guard", status: "Active" },
    "EMP022": { name: "Sunday Orunsolu", pin: "1022", role: "Night Guard", status: "Active" },
    "EMP023": { name: "James", pin: "1023", role: "Night Guard", status: "Active" },
    "EMP024": { name: "Muhammed Museray", pin: "1024", role: "Night Guard", status: "Active" },
    "EMP025": { name: "Moseray Bangura", pin: "1025", role: "Night Guard", status: "Active" },
    "EMP026": { name: "Muhammed Squire", pin: "1026", role: "Night Guard", status: "Active" },
    "EMP027": { name: "Osman A. Kalokoh", pin: "1027", role: "Night Guard", status: "Active" },
    "EMP028": { name: "Abdul Kamara", pin: "1028", role: "Night Guard", status: "Active" },
    "EMP029": { name: "Hawa Kamara", pin: "1029", role: "Day Guard", status: "Active" },
    "EMP030": { name: "Kamara Momoh", pin: "1030", role: "Night Guard", status: "Active" },
    "EMP031": { name: "Prince Momoh", pin: "1031", role: "Night Guard", status: "Active" },
    "EMP032": { name: "Adedeji Mike", pin: "1032", role: "Day Guard", status: "Active" },
    "EMP033": { name: "John Brown", pin: "1033", role: "Day Guard", status: "Active" },
    "EMP034": { name: "Sainey Bah", pin: "1034", role: "Day Guard", status: "Active" },
    "EMP035": { name: "Muhammed Krubally", pin: "1035", role: "Night Guard", status: "Active" },
    "EMP036": { name: "Emanuel Dosunmu", pin: "1036", role: "Day Guard", status: "Active" },
    "EMP037": { name: "Sarjo Bah", pin: "1037", role: "Day Guard", status: "Active" },
    "EMP038": { name: "Muhammed Conteh", pin: "1038", role: "Day Guard", status: "Active" },
    "EMP039": { name: "Hector", pin: "1039", role: "Night Guard", status: "Active" },
    "EMP040": { name: "Unisa Bangura", pin: "1040", role: "Day Guard", status: "Active" },
    "EMP041": { name: "Isaac Monday", pin: "1041", role: "Night Guard", status: "Active" },
    "EMP042": { name: "Lansana Ceesay", pin: "1042", role: "Day Guard", status: "Active" },
    "EMP043": { name: "Muhammed Kanu", pin: "1043", role: "Day Guard", status: "Active" },
    "EMP044": { name: "Arfang Manneh", pin: "1044", role: "Day Guard", status: "Active" },
    "EMP045": { name: "Karamo Fatty", pin: "1045", role: "Night Guard", status: "Active" },
    "EMP046": { name: "Sarjo Jarsey", pin: "1046", role: "Night Guard", status: "Active" },
    "EMP047": { name: "Jonathan Smith", pin: "1047", role: "Day Guard", status: "Active" },
    "EMP048": { name: "Alagie Bangura", pin: "1048", role: "Night Guard", status: "Active" },
    "EMP049": { name: "Ibrahim Camara", pin: "1049", role: "Day Guard", status: "Active" },
    "EMP050": { name: "Oluwa Tobi", pin: "1050", role: "Day Guard", status: "Active" },
    "EMP051": { name: "Muhammed Gassama", pin: "1051", role: "Night Guard", status: "Active" },
    "EMP052": { name: "Sanusi Jobe", pin: "1052", role: "Night Guard", status: "Active" },
    "EMP053": { name: "Muhammed Kamara", pin: "1053", role: "Night Guard", status: "Active" }
};


// ==================== API ENDPOINTS ====================

// Health check endpoint (required by Render)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Fox Eye Tracker API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Guard sends location update
app.post('/api/location', (req, res) => {
    try {
        const { guardId, latitude, longitude, accuracy, battery, guardName } = req.body;
        
        if (!guardId || !latitude || !longitude) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: guardId, latitude, longitude' 
            });
        }
        
        guardLocations[guardId] = {
            id: guardId,
            name: guardName || `Guard ${guardId}`,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            accuracy: accuracy ? parseInt(accuracy) : null,
            battery: battery ? parseInt(battery) : null,
            status: 'online',
            sos: false,
            lastUpdate: new Date().toISOString(),
            speed: req.body.speed || 0,
            heading: req.body.heading || null,
            site: req.body.site || 'On Duty'
        };
        
        console.log(`📍 ${guardId} at ${latitude}, ${longitude} (Accuracy: ${accuracy}m)`);
        
        res.json({ 
            success: true, 
            message: 'Location updated',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Guard sends SOS
app.post('/api/sos', (req, res) => {
    try {
        const { guardId, latitude, longitude, guardName } = req.body;
        
        if (!guardId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing guardId' 
            });
        }
        
        const existingData = guardLocations[guardId] || {};
        
        guardLocations[guardId] = {
            ...existingData,
            id: guardId,
            name: guardName || existingData.name || `Guard ${guardId}`,
            latitude: latitude ? parseFloat(latitude) : existingData.latitude,
            longitude: longitude ? parseFloat(longitude) : existingData.longitude,
            sos: true,
            status: 'online',
            lastUpdate: new Date().toISOString(),
            sosTimestamp: new Date().toISOString()
        };
        
        console.log(`🚨 SOS from ${guardId} at ${latitude},${longitude}`);
        console.log(`🚨 EMERGENCY ALERT: Guard ${guardName || guardId} needs immediate assistance!`);
        
        // In production: Send SMS/Email/Push notifications here
        sendEmergencyAlert(guardLocations[guardId]);
        
        res.json({ 
            success: true, 
            alertSent: true,
            message: 'SOS alert received and notifications sent',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error processing SOS:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process SOS alert' 
        });
    }
});

// Admin gets all locations
app.get('/api/locations', (req, res) => {
    try {
        // Mark guards as offline if no update in 5 minutes
        const fiveMinutesAgo = Date.now() - 300000;
        
        Object.keys(guardLocations).forEach(guardId => {
            const guard = guardLocations[guardId];
            if (guard && guard.lastUpdate) {
                const lastUpdate = new Date(guard.lastUpdate).getTime();
                
                if (lastUpdate < fiveMinutesAgo) {
                    guardLocations[guardId].status = 'offline';
                }
                
                // Auto-clear SOS after 30 minutes
                if (guard.sos && guard.sosTimestamp) {
                    const sosTime = new Date(guard.sosTimestamp).getTime();
                    if (Date.now() - sosTime > 1800000) { // 30 minutes
                        guardLocations[guardId].sos = false;
                    }
                }
            }
        });
        
        const locations = Object.values(guardLocations);
        
        res.json({
            success: true,
            count: locations.length,
            locations: locations,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch locations' 
        });
    }
});

// Get single guard location
app.get('/api/location/:guardId', (req, res) => {
    try {
        const { guardId } = req.params;
        const guard = guardLocations[guardId];
        
        if (!guard) {
            return res.status(404).json({ 
                success: false, 
                error: 'Guard not found' 
            });
        }
        
        res.json({
            success: true,
            location: guard
        });
        
    } catch (error) {
        console.error('Error fetching guard location:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Clear old data (optional cleanup endpoint)
app.post('/api/cleanup', (req, res) => {
    try {
        const oneHourAgo = Date.now() - 3600000;
        let cleanedCount = 0;
        
        Object.keys(guardLocations).forEach(guardId => {
            const guard = guardLocations[guardId];
            if (guard && guard.lastUpdate) {
                const lastUpdate = new Date(guard.lastUpdate).getTime();
                if (lastUpdate < oneHourAgo) {
                    delete guardLocations[guardId];
                    cleanedCount++;
                }
            }
        });
        
        res.json({
            success: true,
            message: `Cleaned up ${cleanedCount} old records`,
            remaining: Object.keys(guardLocations).length
        });
        
    } catch (error) {
        console.error('Error during cleanup:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Cleanup failed' 
        });
    }
});

// API Endpoint: Validate Guard Login
app.post('/api/guard-login', (req, res) => {
    try {
        const { guardId, pin } = req.body;
        
        console.log(`🔐 Login attempt: ${guardId}`);
        
        if (!guardId || !pin) {
            return res.json({ 
                success: false, 
                error: 'Guard ID and PIN are required' 
            });
        }
        
        const guard = guardDatabase[guardId.toUpperCase()];
        
        if (!guard) {
            console.log(`❌ Guard not found: ${guardId}`);
            return res.json({ 
                success: false, 
                error: 'Invalid Guard ID' 
            });
        }
        
        if (guard.pin !== pin) {
            console.log(`❌ Wrong PIN for: ${guardId}`);
            return res.json({ 
                success: false, 
                error: 'Invalid PIN' 
            });
        }
        
        if (guard.status !== 'Active') {
            console.log(`❌ Inactive guard: ${guardId}`);
            return res.json({ 
                success: false, 
                error: 'Account is inactive. Contact supervisor.' 
            });
        }
        
        console.log(`✅ Login successful: ${guard.name} (${guardId})`);
        
        res.json({
            success: true,
            guardId: guardId,
            name: guard.name,
            role: guard.role,
            status: guard.status,
            message: `Welcome ${guard.name}!`
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error during login' 
        });
    }
});

// API Endpoint: Get all guards (for admin)
app.get('/api/guards', (req, res) => {
    try {
        const guards = Object.keys(guardDatabase).map(id => ({
            id: id,
            ...guardDatabase[id]
        }));
        
        res.json({
            success: true,
            count: guards.length,
            guards: guards
        });
        
    } catch (error) {
        console.error('Error fetching guards:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch guards' 
        });
    }
});
// ==================== HTML ROUTES ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/guard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'guard.html'));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET  /health',
            'GET  /admin',
            'GET  /guard',
            'POST /api/location',
            'POST /api/sos',
            'GET  /api/locations',
            'GET  /api/location/:guardId',
            'POST /api/cleanup'
        ]
    });
});

// ==================== HELPER FUNCTIONS ====================

function sendEmergencyAlert(guardData) {
    console.log('🚨 EMERGENCY ALERT SYSTEM ACTIVATED');
    console.log('=====================================');
    console.log(`Guard: ${guardData.name} (${guardData.id})`);
    console.log(`Location: ${guardData.latitude}, ${guardData.longitude}`);
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log('=====================================');
    
    // Integration points (uncomment and configure as needed):
    
    // 1. Twilio SMS (install: npm install twilio)
    // const twilio = require('twilio');
    // const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    // client.messages.create({
    //     body: `🚨 SOS: ${guardData.name} needs help! Location: ${guardData.latitude}, ${guardData.longitude}`,
    //     to: '+1234567890',
    //     from: '+1234567890'
    // });
    
    // 2. SendGrid Email (install: npm install @sendgrid/mail)
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //     to: 'security@example.com',
    //     from: 'alerts@foxeye.com',
    //     subject: '🚨 SOS Emergency Alert',
    //     text: `Guard ${guardData.name} (${guardData.id}) triggered SOS at ${guardData.latitude}, ${guardData.longitude}`
    // };
    // sgMail.send(msg);
    
    // 3. Webhook to external services
    // fetch('https://hooks.slack.com/services/...', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({
    //         text: `🚨 *SOS ALERT*: ${guardData.name} needs immediate assistance!\nLocation: ${guardData.latitude}, ${guardData.longitude}`
    //     })
    // });
}

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log('='.repeat(50));
    console.log('🦊 Fox Eye Security Tracker Server');
    console.log('='.repeat(50));
    console.log(`✅ Server running on http://${HOST}:${PORT}`);
    console.log(`📡 Admin Dashboard: http://${HOST}:${PORT}/admin`);
    console.log(`📱 Guard App: http://${HOST}:${PORT}/guard`);
    console.log(`❤️  Health Check: http://${HOST}:${PORT}/health`);
    console.log('='.repeat(50));
    console.log('Ready to track guards in real-time!');
});
