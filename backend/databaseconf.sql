-- Database Schema Creation Script
-- Generated for NoName schema with Permission System

-- Create database (optional - uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS NoName;
-- USE NoName;
CREATE USER 'ToPa'@'localhost' IDENTIFIED BY '6TZSb2QLkoh7QNQKBDaR';
CREATE DATABASE ToPaD;

-- Grant permission to Topa user on ToPaD database
-- Purpose : connection the backend to the database
GRANT ALL PRIVILEGES ON ToPaD.* TO 'ToPa'@'localhost';
FLUSH PRIVILEGES;

-- Create Database 'ToPaD'
USE ToPaD;

DROP TABLE IF EXISTS Activity_Log;
DROP TABLE IF EXISTS Role_Permission;
DROP TABLE IF EXISTS Permission;
DROP TABLE IF EXISTS Token;
DROP TABLE IF EXISTS Transaction;
DROP TABLE IF EXISTS resider;
DROP TABLE IF EXISTS Adresse;
DROP TABLE IF EXISTS Car_Images;
DROP TABLE IF EXISTS Car_Availability;
DROP TABLE IF EXISTS Active_Rentals;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS Review;

DROP TABLE IF EXISTS Car;
DROP TABLE IF EXISTS Settings;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Role;

-- Table: Role (New table for permission system)
CREATE TABLE Role (
                        ID_Role BIGINT PRIMARY KEY AUTO_INCREMENT,
                        Nom_Role VARCHAR(50) NOT NULL UNIQUE,
                        Description_Role TEXT,
                        Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                        Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Permission (New table for permission system)
CREATE TABLE Permission (
                            ID_Permission BIGINT PRIMARY KEY AUTO_INCREMENT,
                            Nom_Permission VARCHAR(100) NOT NULL UNIQUE,
                            Description_Permission TEXT,
                            Resource VARCHAR(50) NOT NULL,
                            Action VARCHAR(50) NOT NULL,
                            Created_At DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: Role_Permission (Junction table for Role-Permission many-to-many relationship)
CREATE TABLE Role_Permission (
                                 ID_Role BIGINT,
                                 ID_Permission BIGINT,
                                 PRIMARY KEY (ID_Role, ID_Permission),
                                 FOREIGN KEY (ID_Role) REFERENCES Role(ID_Role) ON DELETE CASCADE,
                                 FOREIGN KEY (ID_Permission) REFERENCES Permission(ID_Permission) ON DELETE CASCADE
);

-- Table: Client (Modified to include role support)
CREATE TABLE Client (
                        ID_Client BIGINT PRIMARY KEY AUTO_INCREMENT,
                        Nom_Client VARCHAR(50) NOT NULL,
                        Prenom_Client VARCHAR(50) NOT NULL,
                        Email_Client VARCHAR(70) NOT NULL UNIQUE,
                        Numero_Telephone VARCHAR(50) NOT NULL,
                        Password_Client VARCHAR(100) NOT NULL,
                        ID_Role BIGINT DEFAULT 1, -- Default role (basic user)
                        Is_Active TINYINT DEFAULT 1,
                        Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                        Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        Last_Login DATETIME,
                        FOREIGN KEY (ID_Role) REFERENCES Role(ID_Role) ON DELETE SET NULL
);



-- Table: Activity_Log (New table for audit trail)
CREATE TABLE Activity_Log (
                              ID_Activity BIGINT PRIMARY KEY AUTO_INCREMENT,
                              ID_Client BIGINT,
                              Action VARCHAR(100) NOT NULL,
                              Resource_Type VARCHAR(50) NOT NULL,
                              Resource_ID BIGINT,
                              Details JSON,
                              IP_Address VARCHAR(45),
                              User_Agent TEXT,
                              Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (ID_Client) REFERENCES Client(ID_Client) ON DELETE SET NULL
);

CREATE TABLE Settings (
                        ID_Setting BIGINT PRIMARY KEY AUTO_INCREMENT,
                        ID_Client BIGINT,
                        TwoFactorAuth TINYINT DEFAULT 0,
                        RememberMe TINYINT DEFAULT 0,
                        experimentalFeatures TINYINT DEFAULT 0,
                        NotificationEmail TINYINT DEFAULT 0,
                        NotificationSMS TINYINT DEFAULT 0,
                        NotificationPush TINYINT DEFAULT 0,
                        NotificationMarketing TINYINT DEFAULT 0,
                        Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                        Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (ID_Client) REFERENCES Client(ID_Client) ON DELETE SET NULL

);
Create Table Car (
                        ID_Car BIGINT PRIMARY KEY AUTO_INCREMENT,
                        ID_Seller BIGINT NOT NULL,
                        Name_Car VARCHAR(50) NOT NULL,
                        Marque_Car VARCHAR(50) NOT NULL,
                        Modele_Car VARCHAR(50) NOT NULL,
                        Annee_Car SMALLINT NOT NULL,
                        Kilometrage_Car INT NOT NULL,
                        Description_Car TEXT,
                        Price_Car SMALLINT NOT NULL,
                        Date_Car DATE DEFAULT (CURRENT_DATE),
                        ID_Client BIGINT,
                        Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                        Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (ID_Seller) REFERENCES Client(ID_Client) ON DELETE CASCADE,
                        FOREIGN KEY (ID_Client) REFERENCES Client(ID_Client) ON DELETE CASCADE
);


CREATE TABLE Review (
                        ID_Review BIGINT PRIMARY KEY AUTO_INCREMENT,
                        ID_client BIGINT NOT NULL,
                        ID_car BIGINT NOT NULL,
                        Note_Review SMALLINT NOT NULL,
                        Commentaire_Review TEXT,
                        Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (ID_client) REFERENCES Client(ID_Client) ON DELETE CASCADE,
                        FOREIGN KEY (ID_car) REFERENCES Car(ID_Car) ON DELETE CASCADE
);

CREATE TABLE reservations(
                        ID_Reservation BIGINT PRIMARY KEY AUTO_INCREMENT,
                        ID_Client BIGINT NOT NULL,
                        ID_Car BIGINT NOT NULL,
                        Price_Reservation INT NOT NULL,
                        Status ENUM('available', 'reserved', 'rented', 'maintenance', 'blocked') DEFAULT 'available',
                        Date_Start_Reservation DATE DEFAULT (CURRENT_DATE),
                        Date_End_Reservation DATE DEFAULT (CURRENT_DATE),
                        Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                        Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (ID_Client) REFERENCES Client(ID_Client) ON DELETE CASCADE,
                        FOREIGN KEY (ID_Car) REFERENCES Car(ID_Car) ON DELETE CASCADE,
                        UNIQUE KEY unique_car_date_time (ID_Car, Date_Start_Reservation, Date_End_Reservation)


);

CREATE TABLE Active_Rentals (
                                ID_Active_Rental BIGINT PRIMARY KEY AUTO_INCREMENT,
                                ID_Reservation BIGINT NOT NULL UNIQUE,
                                ID_Car BIGINT NOT NULL,
                                ID_Client BIGINT NOT NULL,
                                Start_Date DATE NOT NULL,
                                End_Date DATE NOT NULL,
                                Actual_Pickup_Time DATETIME,
                                Expected_Return_Time DATETIME,
                                Current_Mileage INT,
                                Security_Deposit_Amount DECIMAL(10,2),
                                Security_Deposit_Status ENUM('pending', 'held', 'released', 'forfeited') DEFAULT 'pending',
                                Rental_Status ENUM('picked_up', 'in_use', 'overdue', 'returning') DEFAULT 'picked_up',
                                Emergency_Contact VARCHAR(20),
                                Special_Instructions TEXT,
                                Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                                Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                FOREIGN KEY (ID_Reservation) REFERENCES reservations(ID_Reservation) ON DELETE CASCADE,
                                FOREIGN KEY (ID_Car) REFERENCES Car(ID_Car) ON DELETE CASCADE,
                                FOREIGN KEY (ID_Client) REFERENCES Client(ID_Client) ON DELETE CASCADE
);

CREATE TABLE Car_Availability (
                                  ID_Availability BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  ID_Car BIGINT NOT NULL,
                                  Date_Start_Available DATE NOT NULL,
                                  Date_End_Available DATE NOT NULL,
                                  Status ENUM('available', 'reserved', 'rented', 'maintenance', 'blocked') DEFAULT 'available',
                                  Start_Time TIME DEFAULT '00:00:00',
                                  End_Time TIME DEFAULT '23:59:59',
                                  Notes TEXT,
                                  Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                                  Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  FOREIGN KEY (ID_Car) REFERENCES Car(ID_Car) ON DELETE CASCADE,
                                  UNIQUE KEY unique_car_date_time (ID_Car, Date_Start_Available, Date_End_Available, Start_Time, End_Time)
);
CREATE TABLE Car_Images (
                            ID_Image BIGINT PRIMARY KEY AUTO_INCREMENT,
                            ID_Car BIGINT NOT NULL,
                            Image_Path VARCHAR(500) NOT NULL,
                            Image_Name VARCHAR(255),
                            Original_Name VARCHAR(255), -- Original filename when uploaded
                            Image_Type ENUM('exterior', 'interior', 'engine', 'dashboard', 'trunk', 'wheels', 'damage', 'documents', 'other') DEFAULT 'other',
                            Image_Description TEXT,
                            Image_Size INT, -- Size in bytes
                            Image_Width SMALLINT, -- Image width in pixels
                            Image_Height SMALLINT, -- Image height in pixels
                            Image_Format ENUM('jpg', 'jpeg', 'png', 'webp', 'gif') DEFAULT 'jpg',
                            Display_Order SMALLINT DEFAULT 0,
                            Is_Primary TINYINT DEFAULT 0,
                            Is_Active TINYINT DEFAULT 1,
                            Uploaded_By BIGINT, -- Who uploaded this image
                            Alt_Text VARCHAR(255), -- For accessibility
                            Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                            Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            FOREIGN KEY (ID_Car) REFERENCES Car(ID_Car) ON DELETE CASCADE,
                            FOREIGN KEY (Uploaded_By) REFERENCES Client(ID_Client) ON DELETE SET NULL
);

-- Table: Adresse
CREATE TABLE Adresse (
                         ID_Adresse BIGINT PRIMARY KEY AUTO_INCREMENT,
                         Numero_Residence SMALLINT,
                         Nom_Rue VARCHAR(50) NOT NULL,
                         Code_Postal INT NOT NULL,
                         Nom_Ville VARCHAR(50) NOT NULL,
                         Nom_Pays VARCHAR(50) NOT NULL
);





-- Table: Token (Enhanced for better security)
CREATE TABLE Token (
                       ID_Client BIGINT,
                       ID_Token VARCHAR(201) PRIMARY KEY,
                       Expiration_Token DATETIME NOT NULL,
                       Token_Type ENUM('access', 'refresh', 'reset_password') DEFAULT 'access',
                       Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (ID_Client) REFERENCES Client(ID_Client) ON DELETE CASCADE
);

-- Table: Transaction
CREATE TABLE Transaction (
                            ID_Transaction BIGINT PRIMARY KEY AUTO_INCREMENT,
                            Name_Transaction VARCHAR(50) NOT NULL,
                            Description_Transaction TEXT,
                            Prix_Transaction SMALLINT NOT NULL,
                            Date_Transaction DATE DEFAULT (CURRENT_DATE),
                            ID_Acheteur BIGINT,
                            ID_Vendeur BIGINT,
                            FOREIGN KEY (ID_ACHETEUR) REFERENCES Client(ID_Client) ON DELETE CASCADE,
                            FOREIGN KEY (ID_VENDEUR) REFERENCES Client(ID_Client) ON DELETE CASCADE
);

-- Table: resider (Junction table for Client-Adresse relationship)
CREATE TABLE resider (
                         ID_Client BIGINT,
                         ID_Adresse BIGINT,
                         PRIMARY KEY (ID_Client, ID_Adresse),
                         FOREIGN KEY (ID_Client) REFERENCES Client(ID_Client) ON DELETE CASCADE,
                         FOREIGN KEY (ID_Adresse) REFERENCES Adresse(ID_Adresse) ON DELETE CASCADE
);





-- Insert default roles
INSERT INTO Role (Nom_Role, Description_Role) VALUES
                                                  ('user', 'Basic user with limited permissions'),
                                                  ('editor', 'Content editor with create and edit permissions'),
                                                  ('moderator', 'Content moderator with publish permissions'),
                                                  ('admin', 'Administrator with full permissions'),
                                                  ('super_admin', 'Super administrator with system-level permissions');

-- Insert default permissions
INSERT INTO Permission (Nom_Permission, Description_Permission, Resource, Action) VALUES
-- Content permissions
('content.create', 'Create new content', 'content', 'create'),
('content.read', 'View content', 'content', 'read'),
('content.update', 'Edit existing content', 'content', 'update'),
('content.delete', 'Delete content', 'content', 'delete'),
('content.publish', 'Publish/unpublish content', 'content', 'publish'),
-- User permissions
('user.create', 'Create new users', 'user', 'create'),
('user.read', 'View user profiles', 'user', 'read'),
('user.update', 'Edit user profiles', 'user', 'update'),
('user.delete', 'Delete users', 'user', 'delete'),
-- System permissions
('system.settings', 'Access system settings', 'system', 'settings'),
('system.logs', 'View system logs', 'system', 'logs'),
-- Camera permissions
('camera.create', 'Add new cameras', 'camera', 'create'),
('camera.read', 'View cameras', 'camera', 'read'),
('camera.update', 'Edit camera settings', 'camera', 'update'),
('camera.delete', 'Remove cameras', 'camera', 'delete'),
('camera.stream', 'Access camera streams', 'camera', 'stream');

-- Assign permissions to roles
-- Basic user permissions
INSERT INTO Role_Permission (ID_Role, ID_Permission) VALUES
                                                         (1, 2), -- content.read
                                                         (1, 7), -- user.read (own profile)
                                                         (1, 11), -- camera.read (own cameras)
                                                         (1, 15); -- camera.stream (own cameras)

-- Editor permissions
INSERT INTO Role_Permission (ID_Role, ID_Permission) VALUES
                                                         (2, 1), -- content.create
                                                         (2, 2), -- content.read
                                                         (2, 3), -- content.update
                                                         (2, 7), -- user.read
                                                         (2, 11), -- camera.read
                                                         (2, 12), -- camera.update
                                                         (2, 15); -- camera.stream

-- Moderator permissions (includes editor permissions + publish)
INSERT INTO Role_Permission (ID_Role, ID_Permission) VALUES
                                                         (3, 1), (3, 2), (3, 3), (3, 5), -- content permissions
                                                         (3, 7), (3, 8), -- user permissions
                                                         (3, 11), (3, 12), (3, 15); -- camera permissions

-- Admin permissions (most permissions except super admin ones)
INSERT INTO Role_Permission (ID_Role, ID_Permission) VALUES
                                                         (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), -- content permissions
                                                         (4, 6), (4, 7), (4, 8), (4, 9), -- user permissions
                                                         (4, 12), -- system.logs
                                                         (4, 10), (4, 11), (4, 13), (4, 15); -- camera permissions

-- Super admin permissions (all permissions)
INSERT INTO Role_Permission (ID_Role, ID_Permission)
SELECT 5, ID_Permission FROM Permission;


-- Database Example with Sample Data


-- Sample Addresses
INSERT INTO Adresse (Numero_Residence, Nom_Rue, Code_Postal, Nom_Ville, Nom_Pays) VALUES
                                                                                      (123, 'Rue de la Paix', 75001, 'Paris', 'France'),
                                                                                      (456, 'Avenue des Champs', 69001, 'Lyon', 'France'),
                                                                                      (789, 'Boulevard Saint-Michel', 13001, 'Marseille', 'France'),
                                                                                      (321, 'Rue Victor Hugo', 31000, 'Toulouse', 'France'),
                                                                                      (654, 'Place de la République', 59000, 'Lille', 'France');

-- Sample Clients with different roles
INSERT INTO Client (Nom_Client, Prenom_Client, Email_Client, Numero_Telephone, Password_Client, ID_Role) VALUES
-- Super Admin
('Admin', 'System', 'admin@topad.com', '+33123456789', '$2b$10$example.hash.for.admin.password', 5),
-- Regular Admin
('Martin', 'Jean', 'jean.martin@email.com', '+33123456790', '$2b$10$example.hash.for.jean.password', 4),
-- Moderator
('Dubois', 'Marie', 'marie.dubois@email.com', '+33123456791', '$2b$10$example.hash.for.marie.password', 3),
-- Editor/Car Seller
('Dupont', 'Pierre', 'pierre.dupont@email.com', '+33123456792', '$2b$10$example.hash.for.pierre.password', 2),
-- Regular Users
('Laurent', 'Sophie', 'sophie.laurent@email.com', '+33123456793', '$2b$10$example.hash.for.sophie.password', 1),
('Moreau', 'Lucas', 'lucas.moreau@email.com', '+33123456794', '$2b$10$example.hash.for.lucas.password', 1),
('Bernard', 'Emma', 'emma.bernard@email.com', '+33123456795', '$2b$10$example.hash.for.emma.password', 1),
('Robert', 'Hugo', 'hugo.robert@email.com', '+33123456796', '$2b$10$example.hash.for.hugo.password', 1);

-- Link clients to addresses
INSERT INTO resider (ID_Client, ID_Adresse) VALUES
                                                (1, 1), -- Admin in Paris
                                                (2, 2), -- Jean in Lyon
                                                (3, 3), -- Marie in Marseille
                                                (4, 1), -- Pierre in Paris
                                                (5, 4), -- Sophie in Toulouse
                                                (6, 5), -- Lucas in Lille
                                                (7, 2), -- Emma in Lyon
                                                (8, 3); -- Hugo in Marseille

-- Sample User Settings
INSERT INTO Settings (ID_Client, TwoFactorAuth, RememberMe, NotificationEmail, NotificationSMS) VALUES
                                                                                                    (1, 1, 1, 1, 1), -- Admin with all security features
                                                                                                    (2, 1, 0, 1, 0), -- Jean with 2FA and email notifications
                                                                                                    (3, 0, 1, 1, 1), -- Marie with notifications enabled
                                                                                                    (4, 0, 0, 1, 0), -- Pierre basic settings
                                                                                                    (5, 0, 1, 1, 0), -- Sophie with email notifications
                                                                                                    (6, 0, 0, 0, 0), -- Lucas minimal notifications
                                                                                                    (7, 0, 1, 1, 1), -- Emma with most notifications
                                                                                                    (8, 0, 0, 1, 0); -- Hugo basic notifications

-- Sample Cars
INSERT INTO Car (ID_Seller, Name_Car, Marque_Car, Modele_Car, Annee_Car, Kilometrage_Car, Description_Car, Prix_Car) VALUES
                                                                                                                         (4, 'Citroën C3 Compact', 'Citroën', 'C3', 2020, 25000, 'Voiture citadine en excellent état, parfaite pour la ville', 180),
                                                                                                                         (4, 'Peugeot 308 Confort', 'Peugeot', '308', 2019, 35000, 'Berline familiale spacieuse avec toutes les options', 220),
                                                                                                                         (2, 'Renault Clio Sport', 'Renault', 'Clio', 2021, 15000, 'Petite voiture sportive, idéale pour les jeunes conducteurs', 160),
                                                                                                                         (2, 'BMW Serie 3 Luxe', 'BMW', 'Serie 3', 2018, 45000, 'Berline de luxe allemande, équipements haut de gamme', 350),
                                                                                                                         (8, 'Volkswagen Golf Premium', 'Volkswagen', 'Golf', 2020, 20000, 'Compacte polyvalente, fiable et économique', 200),
                                                                                                                         (8, 'Mercedes Classe A Style', 'Mercedes', 'Classe A', 2022, 8000, 'Véhicule récent avec les dernières technologies', 280);

-- Sample Car Images
INSERT INTO Car_Images (ID_Car, Image_Path, Image_Name, Original_Name, Image_Type, Image_Description, Display_Order, Is_Primary, Uploaded_By) VALUES
-- Citroën C3 images
(1, '/uploads/cars/1/exterior_front.jpg', 'c3_front', 'citroen_c3_front_view.jpg', 'exterior', 'Vue de face de la Citroën C3', 1, 1, 4),
(1, '/uploads/cars/1/interior_dashboard.jpg', 'c3_interior', 'citroen_c3_dashboard.jpg', 'interior', 'Tableau de bord et habitacle', 2, 0, 4),
-- Peugeot 308 images
(2, '/uploads/cars/2/exterior_side.jpg', 'peugeot_side', 'peugeot_308_side.jpg', 'exterior', 'Vue latérale de la Peugeot 308', 1, 1, 4),
(2, '/uploads/cars/2/trunk.jpg', 'peugeot_trunk', 'peugeot_308_trunk.jpg', 'trunk', 'Coffre spacieux', 3, 0, 4),
-- BMW Serie 3 images
(4, '/uploads/cars/4/bmw_front.jpg', 'bmw_front', 'bmw_serie3_front.jpg', 'exterior', 'BMW Serie 3 vue de face', 1, 1, 2);

-- Sample Car Availability
INSERT INTO Car_Availability (ID_Car, Date_Start_Available, Date_End_Available, Status, Start_Time, End_Time) VALUES
-- Current and future availability
(1, '2024-01-15', '2024-01-20', 'available', '08:00:00', '18:00:00'),
(1, '2024-01-25', '2024-01-30', 'available', '09:00:00', '17:00:00'),
(2, '2024-01-18', '2024-01-25', 'available', '08:00:00', '19:00:00'),
(3, '2024-01-20', '2024-01-27', 'reserved', '10:00:00', '16:00:00'),
(4, '2024-01-22', '2024-02-05', 'available', '08:00:00', '20:00:00'),
(5, '2024-01-16', '2024-01-23', 'rented', '09:00:00', '18:00:00'),
(6, '2024-01-28', '2024-02-10', 'available', '08:00:00', '18:00:00');

-- Sample Reservations
INSERT INTO reservations (ID_Client, ID_Car, Price_Reservation, Status, Date_Start_Reservation, Date_End_Reservation) VALUES
                                                                                                                          (5, 1, 180, 'reserved', '2024-01-15', '2024-01-17'), -- Sophie reserves Citroën C3
                                                                                                                          (6, 2, 220, 'reserved', '2024-01-18', '2024-01-21'), -- Lucas reserves Peugeot 308
                                                                                                                          (7, 3, 160, 'rented', '2024-01-14', '2024-01-16'),   -- Emma has rented Renault Clio
                                                                                                                          (5, 4, 350, 'available', '2024-01-25', '2024-01-28'), -- Sophie's future reservation for BMW
                                                                                                                          (8, 5, 200, 'rented', '2024-01-16', '2024-01-19');   -- Hugo has rented VW Golf

-- Sample Active Rentals
INSERT INTO Active_Rentals (ID_Reservation, ID_Car, ID_Client, Start_Date, End_Date, Actual_Pickup_Time, Current_Mileage, Security_Deposit_Amount, Security_Deposit_Status, Rental_Status, Emergency_Contact) VALUES
                                                                                                                                                                                                                  (3, 3, 7, '2024-01-14', '2024-01-16', '2024-01-14 10:30:00', 15250, 300.00, 'held', 'in_use', '+33123456795'),
                                                                                                                                                                                                                  (5, 5, 8, '2024-01-16', '2024-01-19', '2024-01-16 09:00:00', 20150, 400.00, 'held', 'in_use', '+33123456796');

-- Sample Reviews
INSERT INTO Review (ID_client, ID_car, Note_Review, Commentaire_Review) VALUES
                                                                            (5, 1, 5, 'Excellente voiture, très confortable et économique. Je recommande!'),
                                                                            (6, 2, 4, 'Bonne voiture familiale, spacieuse mais consomme un peu plus que prévu.'),
                                                                            (7, 3, 5, 'Parfaite pour la ville, facile à garer et très maniable.'),
                                                                            (8, 4, 5, 'Luxe et performance au rendez-vous, conduite exceptionnelle.'),
                                                                            (5, 5, 4, 'Fiable et polyvalente, idéale pour les longs trajets.');

-- Sample Transactions
INSERT INTO Transaction (Name_Transaction, Description_Transaction, Prix_Transaction, ID_Acheteur, ID_Vendeur) VALUES
                                                                                                                   ('Location Citroën C3', 'Location de 3 jours - Citroën C3 Compact', 180, 5, 4),
                                                                                                                   ('Location Peugeot 308', 'Location de 4 jours - Peugeot 308 Confort', 220, 6, 4),
                                                                                                                   ('Location Renault Clio', 'Location de 2 jours - Renault Clio Sport', 160, 7, 2),
                                                                                                                   ('Location BMW Serie 3', 'Location de 3 jours - BMW Serie 3 Luxe', 350, 5, 2),
                                                                                                                   ('Location VW Golf', 'Location de 3 jours - Volkswagen Golf Premium', 200, 8, 8);

-- Sample Tokens (for demonstration - in real app these would be generated dynamically)
INSERT INTO Token (ID_Client, ID_Token, Expiration_Token, Token_Type) VALUES
                                                                          (1, 'admin_access_token_example_1234567890', '2024-01-20 10:00:00', 'access'),
                                                                          (2, 'jean_refresh_token_example_0987654321', '2024-02-15 10:00:00', 'refresh'),
                                                                          (5, 'sophie_access_token_example_1122334455', '2024-01-18 15:30:00', 'access');

-- Sample Activity Log
INSERT INTO Activity_Log (ID_Client, Action, Resource_Type, Resource_ID, Details, IP_Address, User_Agent) VALUES
                                                                                                              (1, 'login', 'user', 1, '{"login_method": "email", "success": true}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
                                                                                                              (5, 'create_reservation', 'reservation', 1, '{"car_id": 1, "dates": "2024-01-15 to 2024-01-17", "price": 180}', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'),
                                                                                                              (4, 'add_car', 'car', 1, '{"car_name": "Citroën C3 Compact", "price": 180}', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
                                                                                                              (7, 'pickup_car', 'rental', 3, '{"reservation_id": 3, "pickup_time": "2024-01-14 10:30:00"}', '192.168.1.103', 'Mozilla/5.0 (Android 12; Mobile)'),
                                                                                                              (2, 'update_car_availability', 'car_availability', 4, '{"car_id": 4, "new_dates": "2024-01-22 to 2024-02-05"}', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

-- Create indexes for better performance
CREATE INDEX idx_client_email ON Client(Email_Client);
CREATE INDEX idx_client_role ON Client(ID_Role);
CREATE INDEX idx_client_active ON Client(Is_Active);

CREATE INDEX idx_token_client ON Token(ID_Client);
CREATE INDEX idx_token_expiration ON Token(Expiration_Token);
CREATE INDEX idx_token_type ON Token(Token_Type);
CREATE INDEX idx_transaction_client_acheteur ON Transaction(ID_Acheteur);
CREATE INDEX idx_transaction_client_vendeur ON Transaction(ID_Vendeur);
CREATE INDEX idx_transaction_date ON Transaction(Date_Transaction);
CREATE INDEX idx_activity_client ON Activity_Log(ID_Client);
CREATE INDEX idx_activity_resource ON Activity_Log(Resource_Type, Resource_ID);
CREATE INDEX idx_activity_date ON Activity_Log(Created_At);
CREATE INDEX idx_permission_resource ON Permission(Resource, Action);
CREATE INDEX idx_car_availability_date ON Car_Availability(ID_Car, Date_Start_Available, Date_End_Available);
CREATE INDEX idx_availability_status ON Car_Availability(Status);
CREATE INDEX idx_car_images_car ON Car_Images(ID_Car);
CREATE INDEX idx_car_images_type ON Car_Images(Image_Type);
CREATE INDEX idx_car_images_primary ON Car_Images(ID_Car, Is_Primary);
CREATE INDEX idx_car_images_order ON Car_Images(ID_Car, Display_Order);
CREATE INDEX idx_car_images_active ON Car_Images(Is_Active);
CREATE INDEX idx_car_images_uploader ON Car_Images(Uploaded_By);
CREATE INDEX idx_active_rentals_car ON Active_Rentals(ID_Car);
CREATE INDEX idx_active_rentals_client ON Active_Rentals(ID_Client);
CREATE INDEX idx_active_rentals_dates ON Active_Rentals(Start_Date, End_Date);
CREATE INDEX idx_active_rentals_status ON Active_Rentals(Rental_Status);

