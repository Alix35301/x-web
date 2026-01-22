-- Initialize database and user
-- This script runs automatically when MySQL container starts for the first time

-- Create database if it doesn't exist (already created by MYSQL_DATABASE env var)
-- But ensure it uses utf8mb4
ALTER DATABASE expense_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges to application user (already created by MYSQL_USER env var)
-- Additional grants if needed
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'app_user'@'%';
FLUSH PRIVILEGES;




