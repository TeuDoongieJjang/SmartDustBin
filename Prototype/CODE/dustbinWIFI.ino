#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <UrlEncode.h>

// Configuration structure for bin parameters
struct BinConfig {
    const int trigPin;
    const int echoPin;
    const int lcdTrigPin;
    const int lcdEchoPin;
    const int servoPin;
    const char* serverUrl;
    const char* binType;
    bool isOpen;
    bool isFull;
    bool isSent;
    int clearCount;
    unsigned long lastSensorRead;
    unsigned long lastServerUpdate;
    unsigned long lastSMSUpdate;
    Servo servo;
    LiquidCrystal_I2C* lcd;
};

// Network configuration
const char* const WIFI_SSID = "Chico5";
const char* const WIFI_PASSWORD = "chico@143";
const char* const TEST_SERVER_URL = "https://smart-bin-d25n.onrender.com";

// SMS configuration
String phoneNumber = "+639384605916";  // Include country code without '+' (e.g., "1234567890")
String apiKey = "1658455";  // Get this from Facebook Developer Console

// Pin definitions

// Timing constants
const unsigned long SENSOR_READ_INTERVAL = 100;    // Read sensors every 100ms
const unsigned long SERVER_UPDATE_INTERVAL = 5000; // Update server every 5s
const unsigned long SMS_UPDATE_INTERVAL = 300000;  // Send SMS every 5 minutes

// Global objects
LiquidCrystal_I2C lcd1(0x26, 16, 2);
LiquidCrystal_I2C lcd2(0x27, 16, 2);

// Bin configurations
BinConfig bins[2] = {
    {19, 18, 4, 2, 15, "https://smart-bin-d25n.onrender.com/api/api/add/1", "RECYCLABLE", false, false, false, 0, 0, 0, 0, Servo(), &lcd1},
    {25, 26, 14, 12, 13, "https://smart-bin-d25n.onrender.com/api/api/add/2", "NON - BIO", false, false, false, 0, 0, 0, 0, Servo(), &lcd2}
};

// Function prototypes
bool isReachable();
void initializeWiFi();
void initializeBin(BinConfig& bin);
int measureDistance(int trigPin, int echoPin);
void handleBin(BinConfig& bin);
void visitWeb(const char* serverUrl);
void updateLCD(LiquidCrystal_I2C* lcd, const char* binType);
void sendAlert(String message);

void setup() {
    Serial.begin(115200);  // Increased baud rate
    
    // Initialize WiFi
    initializeWiFi();
    
    
    // Initialize both bins
    for (auto& bin : bins) {
        initializeBin(bin);
    }
}

void loop() {
    unsigned long currentMillis = millis();
    
    // Handle both bins
    for (auto& bin : bins) {
        // Only read sensors at intervals
        if (currentMillis - bin.lastSensorRead >= SENSOR_READ_INTERVAL) {
            handleBin(bin);
            bin.lastSensorRead = currentMillis;
        }
        
        // Handle server updates at intervals
        if (bin.isFull && currentMillis - bin.lastServerUpdate >= SERVER_UPDATE_INTERVAL && bin.isSent) {
            visitWeb(bin.serverUrl);
            bin.lastServerUpdate = currentMillis;
        }
        
        // Handle SMS updates at intervals
        if (bin.isFull && currentMillis - bin.lastSMSUpdate >= SMS_UPDATE_INTERVAL && bin.isSent) {
            bin.lastSMSUpdate = currentMillis;
        }

        bin.isSent = false;
    }
    
    // Process any SMS responses without blocking
}

// Handle bin operations with minimal blocking
void handleBin(BinConfig& bin) {
    int lidDistance = measureDistance(bin.trigPin, bin.echoPin);
    int lcdDistance = measureDistance(bin.lcdTrigPin, bin.lcdEchoPin);
    
    // Handle lid operation
    if (lidDistance < 10) {
        if (bin.isFull) {
            bin.isOpen = bin.isFull = false;
            bin.clearCount = 0;
            bin.lcd->clear();
            bin.servo.write(150);
            delay(1000);
        } else {
            bin.isOpen = true;
            bin.servo.write(0);
            delay(3000);
        }
    } else {
        bin.servo.write(bin.isFull ? 0 : 150);
        bin.isOpen = false;
    }
    
    // Handle fullness detection
    if (lcdDistance < 10 && !bin.isOpen && bin.clearCount <= 0) {
        bin.servo.write(0);
        updateLCD(bin.lcd, bin.binType);
        bin.isFull = bin.isOpen = bin.isSent = true;
        bin.clearCount = min(bin.clearCount + 1, 2);
        sendAlert(String(bin.binType) + " is Full" );
    } else {
        if (bin.clearCount > 2) {
            bin.lcd->clear();
        }
        bin.lcd->noBacklight();
    }
    
    // Update LCD if bin is full
    if (bin.isFull) {
        updateLCD(bin.lcd, bin.binType);
    }
}

void sendAlert(String message) {

  // Data to send with HTTP POST
  String url = "https://api.callmebot.com/whatsapp.php?phone=" + phoneNumber + "&apikey=" + apiKey + "&text=" + urlEncode(message);
  HTTPClient http;
  http.begin(url);

  // Specify content-type header
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");

  // Send HTTP POST request
  int httpResponseCode = http.POST(url);
  while (httpResponseCode != 200){
    
  }
  if (httpResponseCode == 200) {
    Serial.print("Message sent successfully");
  }
  else {
    Serial.println("Error sending the message");
    Serial.print("HTTP response code: ");
    Serial.println(httpResponseCode);
  }

  // Free resources
  http.end();
}

bool isReachable(){
  HTTPClient httpTest;
  httpTest.begin(TEST_SERVER_URL);
  int httpResponseCode = httpTest.GET();
  while(httpResponseCode != 200){
  }
  httpTest.end();
  return (httpResponseCode == 200);
}

// Initialize WiFi connection with timeout
void initializeWiFi() {
    Serial.printf("Connecting to %s ", WIFI_SSID);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    unsigned long startAttempt = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 10000) {
        delay(100);
        Serial.print(".");
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println(" CONNECTED");
    } else {
        Serial.println(" FAILED");
    }
}


// Initialize individual bin components
void initializeBin(BinConfig& bin) {
    bin.lcd->begin();
    bin.lcd->clear();
    bin.lcd->noBacklight();
    bin.servo.attach(bin.servoPin);
    
    pinMode(bin.trigPin, OUTPUT);
    pinMode(bin.echoPin, INPUT);
    pinMode(bin.lcdTrigPin, OUTPUT);
    pinMode(bin.lcdEchoPin, INPUT);
}

// Optimized distance measurement
int measureDistance(int trigPin, int echoPin) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    
    long duration = pulseIn(echoPin, HIGH, 23529);  // Timeout after ~4m
    return (duration == 0) ? 400 : duration * 0.034 / 2;
}

// Non-blocking SMS sending

// Optimized server communication
void visitWeb(const char* serverUrl) {
    if (WiFi.status() == WL_CONNECTED && isReachable()) {
        HTTPClient httpServer;
        httpServer.setConnectTimeout(2000);  // 2 second timeout
        httpServer.begin(serverUrl);
        int responseCode = httpServer.POST("");
        
        if (responseCode > 0) {
            Serial.printf("Server response: %d\n", responseCode);
        } else {
            Serial.printf("POST error: %d\n", responseCode);
        }
        httpServer.end();
    }
}

// Update LCD display
void updateLCD(LiquidCrystal_I2C* lcd, const char* binType) {
    lcd->backlight();
    lcd->setCursor(3, 0);
    lcd->print(binType);
    lcd->setCursor(0, 1);
    lcd->print("DustBin is FULL!");
}