-- TicketWiz Multi-Tenant SaaS Database Schema
-- MySQL Database

CREATE DATABASE IF NOT EXISTS ticketwiz;
USE ticketwiz;

-- Organizations table (tenant table)
CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL UNIQUE,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_domain (domain),
    INDEX idx_api_key (api_key)
);

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'agent') NOT NULL DEFAULT 'agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email_per_org (organization_id, email),
    INDEX idx_organization (organization_id),
    INDEX idx_email (email),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Tickets table
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('open', 'closed', 'resolved') NOT NULL DEFAULT 'open',
    priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    sentiment_score FLOAT DEFAULT NULL,
    ai_suggested_solution TEXT DEFAULT NULL,
    customer_email VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_organization (organization_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Messages table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket (ticket_id),
    INDEX idx_sender (sender_id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
