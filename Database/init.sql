CREATE TABLE IF NOT EXISTS Address
(
    Address_ID  INT AUTO_INCREMENT PRIMARY KEY,
    Street      VARCHAR(255),
    City        VARCHAR(100),
    State       VARCHAR(100),
    Postal_Code VARCHAR(20),
    Country     VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Products
(
    Product_ID      INT AUTO_INCREMENT PRIMARY KEY,
    Barcode         VARCHAR(50),
    Name            VARCHAR(100),
    Storage_Type    VARCHAR(100),
    Expiration_Date DATE
);

CREATE TABLE IF NOT EXISTS Users
(
    User_ID              INT AUTO_INCREMENT PRIMARY KEY,
    Name                 VARCHAR(100),
    Firstname            VARCHAR(100),
    Address_ID           INT,
    Phone                VARCHAR(20),
    Email                VARCHAR(255),
    Password             VARCHAR(255),
    Birthdate            DATE,
    Current_Subscription BOOLEAN,
    Role                 ENUM ('admin', 'volunteer') NOT NULL DEFAULT 'volunteer',
    FOREIGN KEY (Address_ID) REFERENCES Address (Address_ID)
);

CREATE TABLE IF NOT EXISTS Skills
(
    Skill_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name     VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS User_Skills
(
    User_ID         INT,
    Skill_ID        INT,
    Validation_Date DATE,
    PRIMARY KEY (User_ID, Skill_ID),
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID),
    FOREIGN KEY (Skill_ID) REFERENCES Skills (Skill_ID)
);

CREATE TABLE IF NOT EXISTS Trucks
(
    Truck_ID     INT AUTO_INCREMENT PRIMARY KEY,
    Registration VARCHAR(50),
    Capacity     INT,
    Model        VARCHAR(100),
    Conditions   int
);

CREATE TABLE IF NOT EXISTS Subscriptions
(
    User_ID      INT,
    Payment_Date DATE,
    Amount       DECIMAL(10, 2),
    Status       BOOLEAN, -- true for 'paid', false for 'pending'
    PRIMARY KEY (User_ID, Payment_Date),
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID)
);

CREATE TABLE IF NOT EXISTS Schedules
(
    Schedule_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID     INT,
    Date        DATE,
    Type        BOOLEAN, -- true for 'collect', false for 'distribute'
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID)
);

CREATE TABLE IF NOT EXISTS Routes
(
    Route_ID INT AUTO_INCREMENT PRIMARY KEY,
    Date     DATE,
    User_ID  INT,
    Truck_ID INT,
    Type     BOOLEAN, -- true for 'collect', false for 'distribute'
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID),
    FOREIGN KEY (Truck_ID) REFERENCES Trucks (Truck_ID)
);

CREATE TABLE IF NOT EXISTS Schedule_Routes
(
    Schedule_ID INT,
    Route_ID    INT,
    PRIMARY KEY (Schedule_ID, Route_ID),
    FOREIGN KEY (Schedule_ID) REFERENCES Schedules (Schedule_ID),
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID)
);

CREATE TABLE IF NOT EXISTS Route_Donations
(
    Route_ID INT,
    Date     DATE,
    PRIMARY KEY (Route_ID),
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID)
);

CREATE TABLE IF NOT EXISTS Destinations
(
    Destination_ID INT AUTO_INCREMENT PRIMARY KEY,
    Route_ID       INT,
    Address_ID     INT,
    Type           BOOLEAN, -- true for 'collect', false for 'distribute'
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID),
    FOREIGN KEY (Address_ID) REFERENCES Address (Address_ID)
);

CREATE TABLE IF NOT EXISTS Destination_Products
(
    Destination_Product_ID INT AUTO_INCREMENT PRIMARY KEY,
    Destination_ID INT,
    Product_ID     INT,
    Quantity       INT,
    FOREIGN KEY (Destination_ID) REFERENCES Destinations (Destination_ID),
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID)
);

CREATE TABLE IF NOT EXISTS Stocks
(
    Stock_ID     INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID   INT,
    Quantity     INT,
    Storage_Date DATE,
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID)
);

CREATE TABLE IF NOT EXISTS Requests
(
    Request_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT,
    Quantity   INT,
    Date       DATE,
    User_ID    INT,
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID),
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID)
);

CREATE TABLE IF NOT EXISTS Donations
(
    Donation_ID       INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID        INT,
    Quantity          INT,
    Donor_User_ID     INT,
    Recipient_User_ID INT,
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID),
    FOREIGN KEY (Donor_User_ID) REFERENCES Users (User_ID),
    FOREIGN KEY (Recipient_User_ID) REFERENCES Users (User_ID)
);



## 2.2.2. Insertion of data

-- Données de test pour la table Address
INSERT INTO Address (Street, City, State, Postal_Code, Country)
VALUES ('123 Rue de la Paix', 'Paris', 'Île-de-France', '75001', 'France'),
       ('456 Avenue des Champs-Élysées', 'Paris', 'Île-de-France', '75008', 'France'),
       ('789 Boulevard Saint-Germain', 'Paris', 'Île-de-France', '75006', 'France'),
       ('1011 Rue de Rivoli', 'Paris', 'Île-de-France', '75004', 'France'),
       ('1213 Rue du Bac', 'Paris', 'Île-de-France', '75007', 'France');

-- Données de test pour la table Products
INSERT INTO Products (Barcode, Name, Storage_Type, Expiration_Date)
VALUES ('1234567890123', 'Pomme', 'Frais', '2025-12-31'),
       ('2345678901234', 'Pomme de terre', 'Frais', '2024-06-30'),
       ('3456789012345', 'Courgette', 'Frais', '2025-03-15'),
       ('4567890123456', 'Farine', 'Sec', '2023-09-10'),
       ('5678901234567', 'Lait', 'Frais', '2024-11-20');

-- Données de test pour la table Users
INSERT INTO Users (Name, Firstname, Address_ID, Phone, Email, Password, Birthdate, Current_Subscription, Role)
VALUES ('admin', 'admin', 1, '0102030405', 'admin@user.com', 'password', '1985-05-15', true,'admin'),
       ('Martin', 'Lucie', 2, '0607080910', 'l.martin@user.com', 'password', '1990-07-22', false,'volunteer'),
       ('Lefevre', 'Pierre', 3, '0708091011', 'p.lefevre@user.com', 'password', '1980-02-17', true,'volunteer'),
       ('Moreau', 'Sophie', 4, '0809101112', 's.moreau@user.com', 'password', '1995-12-25', false,'volunteer'),
       ('Dubois', 'Louis', 5, '0910111213', 'l.dubois@user.com', 'password', '1978-09-30', true,'volunteer');

-- Données de test pour la table Skills
INSERT INTO Skills (Name)
VALUES ('Permis de conduire'),
       ('Cuisine'),
       ('Bricolage'),
       ('Conseils anti-gaspi'),
       ('Gardiennage'),
       ('Services de réparation'),
       ('Electricité'),
       ('Plomberie'),
       ('Jardinage'),
       ('Informatique');

-- Données de test pour la table User_Skills
INSERT INTO User_Skills (User_ID, Skill_ID, Validation_Date)
VALUES (1, 1, '2023-01-01'),
       (1, 2, '2023-02-01'),
       (2, 3, '2023-03-01'),
       (3, 4, '2023-04-01'),
       (4, 5, '2023-05-01');

-- Données de test pour la table Trucks
INSERT INTO Trucks (Registration, Capacity, Model, Conditions)
VALUES ('ABC123', 10, 'Renault', 2),
       ('DEF456', 15, 'Mercedes', 1),
       ('GHI789', 20, 'Iveco', 4),
       ('JKL012', 25, 'Volvo', 3),
       ('MNO345', 30, 'Scania', 1);

-- Données de test pour la table Subscriptions
INSERT INTO Subscriptions (User_ID, Payment_Date, Amount, Status)
VALUES (1, '2023-01-10', 29.99, true),
       (2, '2023-02-10', 29.99, false),
       (3, '2023-03-10', 29.99, true),
       (4, '2023-04-10', 29.99, false),
       (5, '2023-05-10', 29.99, true);

-- Données de test pour la table Schedules
INSERT INTO Schedules (User_ID, Date, Type)
VALUES (1, '2023-06-01', true),
       (2, '2023-06-02', false),
       (3, '2023-06-03', true),
       (4, '2023-06-04', false),
       (5, '2023-06-05', true);

-- Données de test pour la table Routes
INSERT INTO Routes (Date, User_ID, Truck_ID, Type)
VALUES ('2023-07-01', 1, 1, true),
       ('2023-07-02', 2, 2, false),
       ('2023-07-03', 3, 3, true),
       ('2023-07-04', 4, 4, false),
       ('2023-07-05', 5, 5, true);

-- Données de test pour la table Schedule_Routes
INSERT INTO Schedule_Routes (Schedule_ID, Route_ID)
VALUES (1, 1),
       (2, 2),
       (3, 3),
       (4, 4),
       (5, 5);

-- Données de test pour la table Route_Donations
INSERT INTO Route_Donations (Route_ID, Date)
VALUES (1, '2023-08-01'),
       (2, '2023-08-02'),
       (3, '2023-08-03'),
       (4, '2023-08-04'),
       (5, '2023-08-05');

-- Données de test pour la table Destinations
INSERT INTO Destinations (Route_ID, Address_ID, Type)
VALUES (1, 1, true),
       (1,2,true),
       (2, 2, false),
       (3, 3, true),
       (4, 4, false),
       (5, 5, true);

-- Données de test pour la table Destination_Products
INSERT INTO Destination_Products (Destination_ID, Product_ID, Quantity)
VALUES (1, 1, 100),
       (1,2,10),
       (1, 3, 20),
       (3, 3, 30),
       (4, 4, 40),
       (5, 5, 50),
       (2, 2, 200),
       (3, 3, 300),
       (4, 4, 400),
       (5, 5, 500);

-- Données de test pour la table Stocks
INSERT INTO Stocks (Product_ID, Quantity, Storage_Date)
VALUES (1, 1000, '2023-09-01'),
       (1, 2000, '2024-06-01'),
       (2, 2000, '2023-09-02'),
       (3, 3000, '2023-09-03'),
       (4, 4000, '2023-09-04'),
       (5, 5000, '2023-09-05');

-- Données de test pour la table Requests
INSERT INTO Requests (Product_ID, Quantity, Date, User_ID)
VALUES (1, 10, '2023-10-01', 1),
       (2, 20, '2023-10-02', 2),
       (3, 30, '2023-10-03', 3),
       (4, 40, '2023-10-04', 4),
       (5, 50, '2023-10-05', 5);

-- Données de test pour la table Donations
INSERT INTO Donations (Product_ID, Quantity, Donor_User_ID, Recipient_User_ID)
VALUES (1, 5, 1, 2),
       (2, 10, 2, 3),
       (3, 15, 3, 4),
       (4, 20, 4, 5),
       (4, 20, 2, null),
       (3, 20, 3, null),
       (1, 20, 2, null),
       (5, 25, 5, 1);



