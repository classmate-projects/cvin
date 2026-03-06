const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'P6@b!n@123',
    database: 'resume_store',
});

async function setup() {
    try {
        const connection = await pool.getConnection();

        // Ensure table exists
        await connection.query(`
      CREATE TABLE IF NOT EXISTS app_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        label VARCHAR(100) NOT NULL,
        value VARCHAR(100) NOT NULL,
        placeholder VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Clear existing to re-seed with multi-department support
        console.log('Clearing old config for multi-department update...');
        await connection.query('DELETE FROM app_config');

        const jobTitles = [
            // IT & Tech
            ['job_title', 'Software Engineer', 'Software Engineer', 'e.g. React, Node.js, Python, Java'],
            ['job_title', 'DevOps Engineer', 'DevOps Engineer', 'e.g. Docker, Kubernetes, AWS, CI/CD'],
            ['job_title', 'Data Analyst', 'Data Analyst', 'e.g. SQL, PowerBI, Python, Excel'],

            // Sales & Marketing
            ['job_title', 'Sales Executive', 'Sales Executive', 'e.g. B2B Sales, CRM, Negotiation'],
            ['job_title', 'Marketing Specialist', 'Marketing Specialist', 'e.g. SEO, Content Strategy, Google Ads'],
            ['job_title', 'Customer Success', 'Customer Success', 'e.g. Client Relations, Onboarding, Zendesk'],

            // Finance & Accounts
            ['job_title', 'Accountant', 'Accountant', 'e.g. Tally, GST, Auditing, Financial Reporting'],
            ['job_title', 'Financial Analyst', 'Financial Analyst', 'e.g. Budgeting, Forecasting, SAP'],

            // HR & Admin
            ['job_title', 'HR Manager', 'HR Manager', 'e.g. Talent Acquisition, Employee Relations, Payroll'],
            ['job_title', 'Receptionist / Admin', 'Receptionist / Admin', 'e.g. Office Management, Documentation, Scheduling'],

            // Operations & Logistics
            ['job_title', 'Operations Manager', 'Operations Manager', 'e.g. Supply Chain, Fleet Management, ERP'],
            ['job_title', 'Warehouse Supervisor', 'Warehouse Supervisor', 'e.g. Inventory Control, Safety Protocols'],

            // Hospitality & Retail
            ['job_title', 'Store Manager', 'Store Manager', 'e.g. Retail Operations, Staff Training, P&L'],
            ['job_title', 'Chef / Kitchen Staff', 'Chef / Kitchen Staff', 'e.g. Food Safety, Menu Planning, Culinary Arts']
        ];

        const visaStatuses = [
            ['visa_status', 'Resident / Citizen', 'Resident / Citizen', null],
            ['visa_status', 'Employment Visa', 'Employment Visa', null],
            ['visa_status', 'Work Permit', 'Work Permit', null],
            ['visa_status', 'Visit Visa', 'Visit Visa', null],
            ['visa_status', 'Freelance Visa', 'Freelance Visa', null],
            ['visa_status', 'Other', 'Other', null]
        ];

        const roles = [
            ['role', 'Entry Level', 'Entry Level', null],
            ['role', 'Junior', 'Junior', null],
            ['role', 'Mid-Level', 'Mid-Level', null],
            ['role', 'Senior / Team Lead', 'Senior / Team Lead', null],
            ['role', 'Manager', 'Manager', null],
            ['role', 'Director / Executive', 'Director / Executive', null]
        ];

        const allOptions = [...jobTitles, ...visaStatuses, ...roles];

        console.log('Seeding broad-spectrum department config...');
        await connection.query(
            'INSERT INTO app_config (category, label, value, placeholder) VALUES ?',
            [allOptions]
        );
        console.log('Seed successful. All departments (Sales, Finance, HR, Ops, etc.) are now supported.');

        connection.release();
        process.exit(0);
    } catch (err) {
        console.error('Setup error:', err);
        process.exit(1);
    }
}

setup();
