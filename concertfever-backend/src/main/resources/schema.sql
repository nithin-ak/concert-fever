-- Optional if running SQL statements manually
# DROP DATABASE IF EXISTS concertfever;
# CREATE DATABASE IF NOT EXISTS concertfever;
# USE concertfever;

-- Drop tables if they exist
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS discount_coupons;
DROP TABLE IF EXISTS ticket_category;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS venue;
DROP TABLE IF EXISTS user_confidential;
DROP TABLE IF EXISTS user;

-- Create User Table with Auto-Increment starting from 10001
CREATE TABLE user (
                      user_id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-increment user ID starting at 10001
                      first_name VARCHAR(50) NOT NULL,
                      last_name VARCHAR(50) NOT NULL,
                      email VARCHAR(100) UNIQUE NOT NULL -- Unique email for login
) AUTO_INCREMENT = 10001;


-- Create User Table with Auto-Increment starting from 10001
CREATE TABLE user_confidential (
                      user_id INT PRIMARY KEY,
                      id_created_at DATE NOT NULL,
                      id_last_login DATE NOT NULL,
                      password VARCHAR(255) NOT NULL,
                      password_last_changed_at DATE NOT NULL,
                      account_balance DECIMAL(10, 2) NOT NULL,
                      FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- Create Venue Table with Prefix
CREATE TABLE venue (
                       venue_id INT AUTO_INCREMENT PRIMARY KEY,
                       venue_name VARCHAR(100) NOT NULL,
                       seating_capacity INT NOT NULL,
                       address VARCHAR(255) NOT NULL,
                       country VARCHAR(100) NOT NULL,
                       city VARCHAR(100) NOT NULL,
                       pin_code VARCHAR(10) NOT NULL
);

-- Create Events Table
CREATE TABLE events (
                        event_id INT AUTO_INCREMENT PRIMARY KEY,
                        venue_id INT NOT NULL,
                        organiser_user_id INT NOT NULL,
                        event_name VARCHAR(100) NOT NULL,
                        start_date DATE NOT NULL,
                        end_date DATE NOT NULL,
                        description TEXT,
                        category ENUM('MUSIC', 'SPORT', 'EXHIBITION', 'BUSINESS', 'PHOTOGRAPHY') NOT NULL DEFAULT 'MUSIC',
                        FOREIGN KEY (venue_id) REFERENCES venue (venue_id),
                        FOREIGN KEY (organiser_user_id) REFERENCES user(user_id)
);

-- Create Ticket Category Table
CREATE TABLE ticket_category (
                                event_id INT NOT NULL,
                                ticket_category CHAR(1) NOT NULL,
                                price DECIMAL(10, 2) NOT NULL,
                                total_quantity INT NOT NULL,
                                remaining_quantity INT NOT NULL,
                                PRIMARY KEY (event_id, ticket_category),
                                FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- Create Discount Coupons Table
CREATE TABLE discount_coupons (
                                 coupon_id INT AUTO_INCREMENT PRIMARY KEY,
                                 coupon_code VARCHAR(50) NOT NULL,
                                 event_id INT, -- References event_id in Events
                                 ticket_category CHAR(1), -- Category for the discount
                                 discount_percentage DECIMAL(5, 2) NOT NULL,
                                 expiry_date DATE NOT NULL,
                                 FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- Create Tickets Table
CREATE TABLE tickets (
                         ticket_id INT AUTO_INCREMENT PRIMARY KEY,
                         event_id INT,
                         user_id INT NOT NULL,
                         coupon_id INT,
                         ticket_category CHAR(1) NOT NULL,
                         final_price DECIMAL(10, 2) NOT NULL,
                         purchase_date DATE NOT NULL,
                         FOREIGN KEY (event_id) REFERENCES events(event_id),
                         FOREIGN KEY (user_id) REFERENCES user(user_id),
                         FOREIGN KEY (coupon_id) REFERENCES discount_coupons(coupon_id)
);