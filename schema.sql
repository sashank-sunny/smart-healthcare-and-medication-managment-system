-- MediGuide Relational Database Schema (MySQL Compatible)
CREATE DATABASE IF NOT EXISTS mediguide;
USE mediguide;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, password_hash VARCHAR(64) NOT NULL,
    verified BOOLEAN DEFAULT TRUE, blood_group VARCHAR(10) DEFAULT 'O+ Positive',
    allergies VARCHAR(255) DEFAULT 'Penicillin', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) NOT NULL,
    rating INT NOT NULL, msg TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS reminders (
    id INT AUTO_INCREMENT PRIMARY KEY, med_name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, schedule VARCHAR(100) NOT NULL, notes VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY, rx_code VARCHAR(50) NOT NULL,
    doctor_name VARCHAR(100) NOT NULL, patient_name VARCHAR(100) NOT NULL,
    medicines TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT IGNORE INTO users (username, email, password_hash, verified) VALUES ('Dr. Sashank Sunny', 'sashank@mediguide.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', TRUE);
