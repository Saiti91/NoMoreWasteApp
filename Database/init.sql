CREATE DATABASE IF NOT EXISTS `database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `database`;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS ProductsCategories
(
    Category_ID   INT AUTO_INCREMENT PRIMARY KEY,
    Name          VARCHAR(100) NOT NULL,
    StorageSector VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Products
(
    Product_ID  INT AUTO_INCREMENT PRIMARY KEY,
    Barcode     VARCHAR(50),
    Name        VARCHAR(100),
    Category_ID INT, -- Foreign key to link product to its category
    FOREIGN KEY (Category_ID) REFERENCES ProductsCategories (Category_ID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Address
(
    Address_ID  INT AUTO_INCREMENT PRIMARY KEY,
    Street      VARCHAR(255),
    City        VARCHAR(100),
    State       VARCHAR(100),
    Postal_Code VARCHAR(20),
    Country     VARCHAR(100)
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
    FOREIGN KEY (Address_ID) REFERENCES Address (Address_ID) ON DELETE SET NULL
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
    Validation_Date DATE DEFAULT NULL,
    Document_Path   VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (User_ID, Skill_ID),
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Skill_ID) REFERENCES Skills (Skill_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Trucks
(
    Truck_ID     INT AUTO_INCREMENT PRIMARY KEY,
    Registration VARCHAR(50),
    Capacity     INT,
    Model        VARCHAR(100),
    Conditions   INT
);

CREATE TABLE IF NOT EXISTS Subscriptions
(
    User_ID      INT,
    Payment_Date DATE,
    Amount       DECIMAL(10, 2),
    Status       BOOLEAN, -- true for 'paid', false for 'pending'
    PRIMARY KEY (User_ID, Payment_Date),
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Schedules
(
    Schedule_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID     INT,
    Date        DATE,
    Type        BOOLEAN, -- true for 'collect', false for 'distribute'
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Routes
(
    Route_ID INT AUTO_INCREMENT PRIMARY KEY,
    Date     DATE,
    User_ID  INT NULL,
    Truck_ID INT,
    Type     BOOLEAN, -- true for 'collect', false for 'distribute'
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Truck_ID) REFERENCES Trucks (Truck_ID)
);

CREATE TABLE IF NOT EXISTS Schedule_Routes
(
    Schedule_ID INT,
    Route_ID    INT,
    PRIMARY KEY (Schedule_ID, Route_ID),
    FOREIGN KEY (Schedule_ID) REFERENCES Schedules (Schedule_ID) ON DELETE CASCADE,
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Route_Donations
(
    Route_ID INT,
    Date     DATE,
    PRIMARY KEY (Route_ID),
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Destinations
(
    Destination_ID INT AUTO_INCREMENT PRIMARY KEY,
    Route_ID       INT,
    Address_ID     INT,
    Type           BOOLEAN, -- true for 'collect', false for 'distribute'
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID) ON DELETE CASCADE,
    FOREIGN KEY (Address_ID) REFERENCES Address (Address_ID)
);

CREATE TABLE IF NOT EXISTS Destination_Products
(
    Destination_Product_ID INT AUTO_INCREMENT PRIMARY KEY,
    Destination_ID         INT,
    Product_ID             INT,
    Quantity               INT,
    FOREIGN KEY (Destination_ID) REFERENCES Destinations (Destination_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID)
);

CREATE TABLE IF NOT EXISTS Stocks
(
    Stock_ID   INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT,
    Quantity   INT,
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Requests
(
    Request_ID     INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID     INT,
    Quantity       INT,
    Date           DATE,
    User_ID        INT,
    Route_ID       INT  NULL,
    Processed      BOOLEAN DEFAULT FALSE,
    Processed_Date DATE NULL,
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID) ON DELETE SET NULL,
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Route_Requests
(
    Route_ID   INT,
    Request_ID INT,
    PRIMARY KEY (Route_ID, Request_ID),
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID) ON DELETE CASCADE,
    FOREIGN KEY (Request_ID) REFERENCES Requests (Request_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Donations
(
    Donation_ID     INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID      INT,
    Quantity        INT,
    Date            DATE,
    Donor_User_ID   INT,                                                         -- Reference to the user who made the donation (can be NULL for anonymous donations)
    Route_ID        INT  NULL,                                                   -- Reference to the route (tour) to which the donation is assigned (NULL if not assigned)
    Collected       BOOLEAN DEFAULT false,                                       -- Indicates if the donation has been collected (default is false)
    Collection_Date DATE NULL,                                                   -- Date when the donation was collected (NULL if not yet collected)
    FOREIGN KEY (Route_ID) REFERENCES Routes (Route_ID) ON DELETE SET NULL,      -- If the route is deleted, set Route_ID to NULL
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID) ON DELETE CASCADE, -- If the product is deleted, delete the donation
    FOREIGN KEY (Donor_User_ID) REFERENCES Users (User_ID) ON DELETE SET NULL    -- If the user is deleted, delete the donation
);


CREATE TABLE IF NOT EXISTS Statuses
(
    Status_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name      VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Tickets
(
    Ticket_ID         INT AUTO_INCREMENT PRIMARY KEY,
    Title             VARCHAR(50),
    Direction         BOOLEAN,
    Start_Date        DATE,
    Duration          INT,
    Places            INT,
    Tools             VARCHAR(50),
    Address_ID        INT,
    Address_needs     BOOLEAN,
    Customers_Address VARCHAR(100),
    Description       TEXT,
    Image             VARCHAR(50),
    Status_ID         INT,
    Owner_User_ID     INT,
    FOREIGN KEY (Address_ID) REFERENCES Address (Address_ID),
    FOREIGN KEY (Status_ID) REFERENCES Statuses (Status_ID),
    FOREIGN KEY (Owner_User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE
);

CREATE TABLE Recipes
(
    Recipes_ID   INT PRIMARY KEY AUTO_INCREMENT,
    Name         VARCHAR(255),
    Instructions TEXT
);

CREATE TABLE Recipes_Ingredients
(
    Recipes_ID  INT,
    Product_ID  INT,
    Quantity    DECIMAL(10, 2), -- Pour les quantités numériques
    Unit        VARCHAR(50),-- Pour l'unité de mesure
    Description VARCHAR(255),-- Pour les quantités textuelles (ex : "une pincée", "au goût")
    FOREIGN KEY (Recipes_ID) REFERENCES Recipes (Recipes_ID),
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID)
);

-- Fin des tickets

## 2.2.2. Insertion of data

-- Données de test pour la table Address
INSERT INTO Address (Street, City, State, Postal_Code, Country)
VALUES ('123 Rue de la Paix', 'Paris', 'Île-de-France', '75001', 'France'),
       ('456 Avenue des Champs-Élysées', 'Paris', 'Île-de-France', '75008', 'France'),
       ('789 Boulevard Saint-Germain', 'Paris', 'Île-de-France', '75006', 'France'),
       ('1011 Rue de Rivoli', 'Paris', 'Île-de-France', '75004', 'France'),
       ('1213 Rue du Bac', 'Paris', 'Île-de-France', '75007', 'France');

-- Données de test pour la table ProductCategories
INSERT INTO ProductsCategories (Name, StorageSector)
VALUES ('Fruits et Légumes', 'A1'),
       ('Viandes et Poissons', 'A2'),
       ('Pains et Pâtisseries', 'A3'),
       ('Crèmerie et Produits laitiers', 'A4'),
       ('Charcuterie et Traiteur', 'A5'),
       ('Surgelés', 'B1'),
       ('Boissons', 'B2'),
       ('Épicerie salée', 'B3'),
       ('Épicerie sucrée', 'B4'),
       ('Produits du monde', 'B5'),
       ('Nutrition et Végétale', 'C1'),
       ('Bébé', 'C2'),
       ('Entretien et Nettoyage', 'C3'),
       ('Hygiène et Beauté', 'C4'),
       ('Parapharmacie', 'D1');

-- Données de test pour la table Products
INSERT INTO Products (Barcode, Name, Category_ID)
VALUES
-- Fruits et Légumes (Category_ID = 1)
('1234567890123', 'Pomme', 1),
('1234567890124', 'Banane', 1),
('1234567890125', 'Carotte', 1),
('1234567890126', 'Tomate', 1),
('1234567890127', 'Poivron', 1),

-- Viandes et Poissons (Category_ID = 2)
('2234567890123', 'Steak de bœuf', 2),
('2234567890124', 'Poulet', 2),
('2234567890125', 'Saumon', 2),
('2234567890126', 'Thon', 2),
('2234567890127', 'Jambon', 2),

-- Pains et Pâtisseries (Category_ID = 3)
('3234567890123', 'Baguette', 3),
('3234567890124', 'Croissant', 3),
('3234567890125', 'Pain complet', 3),
('3234567890126', 'Brioche', 3),
('3234567890127', 'Tarte aux pommes', 3),

-- Crèmerie et Produits laitiers (Category_ID = 4)
('4234567890123', 'Lait', 4),
('4234567890124', 'Beurre', 4),
('4234567890125', 'Yaourt', 4),
('4234567890126', 'Crème fraîche', 4),
('4234567890127', 'Fromage', 4),

-- Charcuterie et Traiteur (Category_ID = 5)
('5234567890123', 'Saucisson', 5),
('5234567890124', 'Terrine', 5),
('5234567890125', 'Pâté', 5),
('5234567890126', 'Rillette', 5),
('5234567890127', 'Jambon cuit', 5),

-- Surgelés (Category_ID = 6)
('6234567890123', 'Glace à la vanille', 6),
('6234567890124', 'Poisson pané', 6),
('6234567890125', 'Pizza surgelée', 6),
('6234567890126', 'Frites surgelées', 6),
('6234567890127', 'Légumes surgelés', 6),

-- Boissons (Category_ID = 7)
('7234567890123', 'Eau minérale', 7),
('7234567890124', 'Jus d\'orange', 7),
('7234567890125', 'Coca-Cola', 7),
('7234567890126', 'Vin rouge', 7),
('7234567890127', 'Bière', 7),

-- Épicerie salée (Category_ID = 8)
('8234567890123', 'Pâtes', 8),
('8234567890124', 'Riz', 8),
('8234567890125', 'Conserve de tomates', 8),
('8234567890126', 'Huile d\'olive', 8),
('8234567890127', 'Sel', 8),

-- Épicerie sucrée (Category_ID = 9)
('9234567890123', 'Chocolat noir', 9),
('9234567890124', 'Biscuits', 9),
('9234567890125', 'Confiture de fraises', 9),
('9234567890126', 'Miel', 9),
('9234567890127', 'Bonbons', 9),

-- Produits du monde (Category_ID = 10)
('10234567890123', 'Nouilles asiatiques', 10),
('10234567890124', 'Sauce soja', 10),
('10234567890125', 'Tortillas', 10),
('10234567890126', 'Salsa mexicaine', 10),
('10234567890127', 'Curry en poudre', 10),

-- Nutrition et Végétale (Category_ID = 11)
('11234567890123', 'Tofu', 11),
('11234567890124', 'Lait d\'amande', 11),
('11234567890125', 'Steak végétal', 11),
('11234567890126', 'Yaourt de soja', 11),
('11234567890127', 'Protéine de pois', 11),

-- Bébé (Category_ID = 12)
('12234567890123', 'Lait infantile', 12),
('12234567890124', 'Petits pots légumes', 12),
('12234567890125', 'Couches', 12),
('12234567890126', 'Lingettes', 12),
('12234567890127', 'Crème pour bébé', 12),

-- Entretien et Nettoyage (Category_ID = 13)
('13234567890123', 'Liquide vaisselle', 13),
('13234567890124', 'Désinfectant', 13),
('13234567890125', 'Lessive en poudre', 13),
('13234567890126', 'Nettoyant multi-surfaces', 13),
('13234567890127', 'Éponge', 13),

-- Hygiène et Beauté (Category_ID = 14)
('14234567890123', 'Shampoing', 14),
('14234567890124', 'Gel douche', 14),
('14234567890125', 'Dentifrice', 14),
('14234567890126', 'Déodorant', 14),
('14234567890127', 'Crème hydratante', 14),

-- Parapharmacie (Category_ID = 15)
('15234567890123', 'Compléments alimentaires', 15),
('15234567890124', 'Pansements', 15),
('15234567890125', 'Désinfectant pour plaies', 15),
('15234567890126', 'Gel désinfectant', 15),
('15234567890127', 'Thermomètre', 15);

-- Données de test pour la table Users
INSERT INTO Users (Name, Firstname, Address_ID, Phone, Email, Password, Birthdate, Current_Subscription, Role)
VALUES ('admin', 'admin', 1, '0102030405', 'admin@user.com', 'password', '1985-05-15', true, 'admin'),
       ('Martin', 'Lucie', 2, '0607080910', 'l.martin@user.com', 'password', '1990-07-22', false, 'volunteer'),
       ('Lefèvre', 'Pierre', 3, '0708091011', 'p.lefevre@user.com', 'password', '1980-02-17', true, 'volunteer'),
       ('Moreau', 'Sophie', 4, '0809101112', 's.moreau@user.com', 'password', '1995-12-25', false, 'volunteer'),
       ('Dubois', 'Louis', 5, '0910111213', 'l.dubois@user.com', 'password', '1978-09-30', true, 'volunteer');

-- Données de test pour la table Skills
INSERT INTO Skills (Name)
VALUES ('Permis de conduire'),
       ('Cuisine'),
       ('Bricolage'),
       ('Conseils anti-gaspi'),
       ('Gardiennage'),
       ('Services de réparation'),
       ('Électricité'),
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
       (1, 2, true),
       (2, 2, false),
       (3, 3, true),
       (4, 4, false),
       (5, 5, true);

-- Données de test pour la table Destination_Products
INSERT INTO Destination_Products (Destination_ID, Product_ID, Quantity)
VALUES (1, 1, 100),
       (1, 2, 10),
       (1, 3, 20),
       (3, 3, 30),
       (4, 4, 40),
       (5, 5, 50),
       (2, 2, 200),
       (3, 3, 300),
       (4, 4, 400),
       (5, 5, 500);

-- Données de test pour la table Stocks
INSERT INTO Stocks (Product_ID, Quantity)
VALUES
-- Fruits et Légumes (Category_ID = 1)
(1, 100),
(2, 200),
(3, 300),
(4, 400),
(5, 500),

-- Viandes et Poissons (Category_ID = 2)
(6, 150),
(7, 250),
(8, 350),
(9, 450),
(10, 550),

-- Pains et Pâtisseries (Category_ID = 3)
(11, 600),
(12, 700),
(13, 800),
(14, 900),
(15, 1000),

-- Crèmerie et Produits laitiers (Category_ID = 4)
(16, 1100),
(17, 1200),
(18, 1300),
(19, 1400),
(20, 1500),

-- Charcuterie et Traiteur (Category_ID = 5)
(21, 1600),
(22, 1700),
(23, 1800),
(24, 1900),
(25, 2000),

-- Surgelés (Category_ID = 6)
(26, 2100),
(27, 2200),
(28, 2300),
(29, 2400),
(30, 2500),

-- Boissons (Category_ID = 7)
(31, 2600),
(32, 2700),
(33, 2800),
(34, 2900),
(35, 3000),

-- Épicerie salée (Category_ID = 8)
(36, 3100),
(37, 3200),
(38, 3300),
(39, 3400),
(40, 3500),

-- Épicerie sucrée (Category_ID = 9)
(41, 3600),
(42, 3700),
(43, 3800),
(44, 3900),
(45, 4000),

-- Produits du monde (Category_ID = 10)
(46, 4100),
(47, 4200),
(48, 4300),
(49, 4400),
(50, 4500),

-- Nutrition et Végétale (Category_ID = 11)
(51, 4600),
(52, 4700),
(53, 4800),
(54, 4900),
(55, 5000),

-- Bébé (Category_ID = 12)
(56, 5100),
(57, 5200),
(58, 5300),
(59, 5400),
(60, 5500),

-- Entretien et Nettoyage (Category_ID = 13)
(61, 5600),
(62, 5700),
(63, 5800),
(64, 5900),
(65, 6000),

-- Hygiène et Beauté (Category_ID = 14)
(66, 6100),
(67, 6200),
(68, 6300),
(69, 6400),
(70, 6500),

-- Parapharmacie (Category_ID = 15)
(71, 6600),
(72, 6700),
(73, 6800),
(74, 6900),
(75, 7000);

-- Données de test pour la table Requests
INSERT INTO Requests (Product_ID, Quantity, Date, User_ID, Route_ID, Processed, Processed_Date)
VALUES (1, 10, '2023-10-01', 3, 1, TRUE, '2023-10-02'),
       (2, 20, '2023-10-02', 2, 2, TRUE, '2023-10-03'),
       (3, 30, '2023-10-03', 3, NULL, FALSE, NULL),
       (7, 30, '2023-10-03', 3, NULL, FALSE, NULL),
       (4, 40, '2023-10-04', 4, NULL, FALSE, NULL),
       (5, 50, '2023-10-05', 5, NULL, FALSE, NULL);

-- Données de test pour la table Route_Requests
INSERT INTO Route_Requests (Route_ID, Request_ID)
VALUES (1, 1),
       (2, 2);

-- Données de test pour la table Donations
INSERT INTO Donations (Product_ID, Quantity, Donor_User_ID, Date, Route_ID, Collected, Collection_Date)
VALUES (1, 5, 1, '2024-01-01', 1, true, '2024-01-02'),
       (2, 10, 2, '2024-01-02', 2, false, NULL),
       (3, 15, 3, '2024-01-03', 3, true, '2024-01-04'),
       (4, 20, 4, '2024-01-04', NULL, false, NULL),
       (4, 20, 2, '2024-01-05', 4, true, '2024-01-06'),
       (3, 20, 3, '2024-01-06', NULL, false, NULL),
       (1, 20, 2, '2024-01-07', 5, false, NULL),
       (5, 25, 5, '2024-01-08', 1, true, '2024-01-09');

-- Données de test pour la table Statuses
INSERT INTO Statuses (Name)
VALUES ('Inscription Ouverte'),
       ('Inscription Fermée'),
       ('Terminé');


-- Insérer les recettes dans la table Recipes
INSERT INTO Recipes (Name, Instructions)
VALUES ('Salade de poulet aux légumes',
        'Grillez le poulet, coupez la tomate et le poivron en dés, mélangez avec des feuilles de salade verte, assaisonnez avec de l''huile d''olive et du sel.'),
       ('Pâtes au saumon et crème fraîche',
        'Faites cuire les pâtes, ajoutez le saumon coupé en morceaux, mélangez avec la crème fraîche, assaisonnez avec du sel.'),
       ('Pizza surgelée garnie',
        'Ajoutez des morceaux de fromage, de poivron et de tomate sur la pizza surgelée avant de la cuire au four selon les instructions.'),
       ('Tortillas au steak de bœuf',
        'Faites griller le steak de bœuf, coupez-le en fines lamelles, garnissez les tortillas avec le steak, la salsa et des morceaux de poivron.'),
       ('Salade de fruits',
        'Coupez la pomme et la banane en morceaux, mélangez-les, ajoutez un peu de jus d''orange pour assaisonner.'),
       ('Baguette au jambon et fromage',
        'Coupez la baguette en deux, tartinez-la de beurre, ajoutez des tranches de jambon et de fromage, passez au four pour faire fondre le fromage.'),
       ('Poisson pané et frites',
        'Faites cuire le poisson pané et les frites surgelées au four selon les instructions sur l''emballage.'),
       ('Nouilles asiatiques au tofu',
        'Faites cuire les nouilles, faites sauter le tofu dans un peu d''huile, ajoutez les nouilles et la sauce soja, mélangez bien.'),
       ('Brioche au chocolat noir',
        'Coupez la brioche en tranches, placez des morceaux de chocolat noir entre deux tranches, faites chauffer au four pour faire fondre le chocolat.'),
       ('Smoothie banane-lait', 'Mixez la banane avec le lait, ajoutez du miel pour sucrer si désiré.');

-- Pour "Salade de poulet aux légumes"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (1, (SELECT Product_ID FROM Products WHERE Barcode = '2234567890124'), 1, 'pièce', NULL), -- Poulet
       (1, (SELECT Product_ID FROM Products WHERE Barcode = '1234567890126'), 1, 'pièce', NULL), -- Tomate
       (1, (SELECT Product_ID FROM Products WHERE Barcode = '1234567890127'), 1, 'pièce', NULL), -- Poivron
       (1, (SELECT Product_ID FROM Products WHERE Barcode = '8234567890126'), 2, 'cuillères à soupe',
        NULL),                                                                                   -- Huile d'olive
       (1, (SELECT Product_ID FROM Products WHERE Barcode = '8234567890127'), NULL, NULL, 'Au goût');
-- Sel

-- Pour "Pâtes au saumon et crème fraîche"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (2, (SELECT Product_ID FROM Products WHERE Barcode = '8234567890123'), 200, 'grammes', NULL), -- Pâtes
       (2, (SELECT Product_ID FROM Products WHERE Barcode = '2234567890125'), 150, 'grammes', NULL), -- Saumon
       (2, (SELECT Product_ID FROM Products WHERE Barcode = '4234567890126'), 100, 'ml', NULL),      -- Crème fraîche
       (2, (SELECT Product_ID FROM Products WHERE Barcode = '8234567890127'), NULL, NULL, 'Au goût');
-- Sel

-- Pour "Pizza surgelée garnie"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (3, (SELECT Product_ID FROM Products WHERE Barcode = '6234567890125'), 1, 'pièce', NULL),     -- Pizza surgelée
       (3, (SELECT Product_ID FROM Products WHERE Barcode = '4234567890127'), 100, 'grammes', NULL), -- Fromage
       (3, (SELECT Product_ID FROM Products WHERE Barcode = '1234567890127'), 1, 'pièce', NULL),     -- Poivron
       (3, (SELECT Product_ID FROM Products WHERE Barcode = '1234567890126'), 1, 'pièce', NULL);
-- Tomate

-- Pour "Tortillas au steak de bœuf"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (4, (SELECT Product_ID FROM Products WHERE Barcode = '10234567890125'), 2, 'pièces', NULL),   -- Tortillas
       (4, (SELECT Product_ID FROM Products WHERE Barcode = '2234567890123'), 200, 'grammes', NULL), -- Steak de bœuf
       (4, (SELECT Product_ID FROM Products WHERE Barcode = '10234567890126'), 3, 'cuillères à soupe',
        NULL),                                                                                       -- Salsa mexicaine
       (4, (SELECT Product_ID FROM Products WHERE Barcode = '1234567890127'), 1, 'pièce', NULL);
-- Poivron

-- Pour "Salade de fruits"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (5, (SELECT Product_ID FROM Products WHERE Barcode = '1234567890123'), 1, 'pièce', NULL), -- Pomme
       (5, (SELECT Product_ID FROM Products WHERE Barcode = '1234567890124'), 1, 'pièce', NULL), -- Banane
       (5, (SELECT Product_ID FROM Products WHERE Barcode = '7234567890124'), 50, 'ml', NULL);
-- Jus d'orange

-- Pour "Baguette au jambon et fromage"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (6, (SELECT Product_ID FROM Products WHERE Barcode = '3234567890123'), 1, 'pièce', NULL),    -- Baguette
       (6, (SELECT Product_ID FROM Products WHERE Barcode = '2234567890127'), 2, 'tranches', NULL), -- Jambon
       (6, (SELECT Product_ID FROM Products WHERE Barcode = '4234567890127'), 2, 'tranches', NULL), -- Fromage
       (6, (SELECT Product_ID FROM Products WHERE Barcode = '4234567890124'), 1, 'cuillère à soupe', NULL);
-- Beurre

-- Pour "Poisson pané et frites"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (7, (SELECT Product_ID FROM Products WHERE Barcode = '6234567890124'), 2, 'pièces', NULL), -- Poisson pané
       (7, (SELECT Product_ID FROM Products WHERE Barcode = '6234567890126'), 200, 'grammes', NULL);
-- Frites surgelées

-- Pour "Nouilles asiatiques au tofu"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (8, (SELECT Product_ID FROM Products WHERE Barcode = '10234567890123'), 100, 'grammes',
        NULL),                                                                                        -- Nouilles asiatiques
       (8, (SELECT Product_ID FROM Products WHERE Barcode = '11234567890123'), 150, 'grammes', NULL), -- Tofu
       (8, (SELECT Product_ID FROM Products WHERE Barcode = '10234567890124'), 2, 'cuillères à soupe', NULL);
-- Sauce soja

-- Pour "Brioche au chocolat noir"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (9, (SELECT Product_ID FROM Products WHERE Barcode = '3234567890126'), 2, 'tranches', NULL), -- Brioche
       (9, (SELECT Product_ID FROM Products WHERE Barcode = '9234567890123'), 50, 'grammes', NULL);
-- Chocolat noir

-- Pour "Smoothie banane-lait"
INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
VALUES (10, (SELECT Product_ID FROM Products WHERE Barcode = '1234567890124'), 1, 'pièce', NULL), -- Banane
       (10, (SELECT Product_ID FROM Products WHERE Barcode = '4234567890123'), 200, 'ml', NULL),  -- Lait
       (10, (SELECT Product_ID FROM Products WHERE Barcode = '9234567890126'), 1, 'cuillère à soupe',
        'Facultatif'); -- Miel
