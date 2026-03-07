-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resume table
CREATE TABLE IF NOT EXISTS resume (
    resume_id SERIAL PRIMARY KEY,
    candidate_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    storage_path TEXT NOT NULL, -- Path to the file in Supabase Storage
    age VARCHAR(10) NULL,
    job_title VARCHAR(255) NULL,
    visa_status VARCHAR(100) NULL,
    experience_years INT NULL,
    specialization VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    location VARCHAR(255) NULL,
    education TEXT NULL,
    role VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create app_config table
CREATE TABLE IF NOT EXISTS app_config (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    placeholder VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin if not exists
INSERT INTO users (name, email, password, role)
VALUES ('System Administrator', 'admin', 'admin', 'Admin')
ON CONFLICT (email) DO NOTHING;
