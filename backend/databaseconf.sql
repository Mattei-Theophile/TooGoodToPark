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
                        FOREIGN KEY (ID_Setting) REFERENCES Client(ID_Client) ON DELETE SET NULL

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