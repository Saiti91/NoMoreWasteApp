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
    User_ID      INT AUTO_INCREMENT PRIMARY KEY,
    Name         VARCHAR(100),
    Firstname    VARCHAR(100),
    Address_ID   INT,
    Phone        VARCHAR(20),
    Email        VARCHAR(255),
    Password     VARCHAR(255),
    Birthdate    DATE,
    IsRegistered BOOLEAN,
    Role         ENUM ('admin', 'volunteer') NOT NULL DEFAULT 'volunteer',
    FOREIGN KEY (Address_ID) REFERENCES Address (Address_ID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Skills
(
    Skill_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name     VARCHAR(100),
    UseType  BOOLEAN
);

CREATE TABLE IF NOT EXISTS User_Skills
(
    User_ID         INT,
    Skill_ID        INT,
    Validation_Date DATE         DEFAULT NULL,
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
    User_ID  INT,
    End_Date DATE,
    Amount   DECIMAL(10, 2),
    Status   BOOLEAN, -- true for 'paid', false for 'pending'
    PRIMARY KEY (User_ID, End_Date),
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
    Time     TIME,
    User_ID  INT NULL,
    Truck_ID INT,
    Type     BOOLEAN, -- true for 'collect', false for 'distribute'
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Truck_ID) REFERENCES Trucks (Truck_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Schedule_Routes
(
    Schedule_ID INT,
    Route_ID    INT,
    PRIMARY KEY (Schedule_ID, Route_ID),
    FOREIGN KEY (Schedule_ID) REFERENCES Schedules (Schedule_ID) ON DELETE CASCADE,
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
    Ticket_ID           INT AUTO_INCREMENT PRIMARY KEY,
    Title               VARCHAR(255) NOT NULL,
    Direction           BOOLEAN      NOT NULL, -- true for 'proposition', false for 'demande'
    Start_Date          DATE         NOT NULL, -- date de début de l'activité
    Start_Time          TIME         NOT NULL, -- heure de début de l'activité
    End_Of_Subscription DATE         NOT NULL, -- date de fin des inscriptions
    Duration            INT          NOT NULL, -- durée de l'activité en minutes
    Places              INT,                   -- nombre de places disponibles maximum, optionnel
    Tools               VARCHAR(255),          -- optionnel
    Address_ID          INT,
    Address_needs       BOOLEAN      NOT NULL, -- Si l'adresse des inscrits est nécessaire
    Customers_Address   VARCHAR(100),          -- faire une table intermédiaire avec user par exemple, optionnel
    Description         TEXT         NOT NULL,
    Image               VARCHAR(255),          -- optionnel
    Status_ID           INT,                   -- statut de la proposition ou demande
    Owner_User_ID       INT          NOT NULL, -- personne qui crée le ticket
    Skill_ID            INT,                   -- clé étrangère vers Skills
    FOREIGN KEY (Address_ID) REFERENCES Address (Address_ID),
    FOREIGN KEY (Status_ID) REFERENCES Statuses (Status_ID),
    FOREIGN KEY (Owner_User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Skill_ID) REFERENCES Skills (Skill_ID)
);

CREATE TABLE IF NOT EXISTS Ticket_Users
(
    Ticket_ID INT,
    User_ID   INT,
    PRIMARY KEY (Ticket_ID, User_ID),
    FOREIGN KEY (Ticket_ID) REFERENCES Tickets (Ticket_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE
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
INSERT INTO Users (Name, Firstname, Address_ID, Phone, Email, Password, Birthdate, IsRegistered, Role)
VALUES ('admin', 'admin', 1, '0102030405', 'admin@user.com', 'password', '1985-05-15', true, 'admin'),
       ('Martin', 'Lucie', 2, '0607080910', 'l.martin@user.com', 'password', '1990-07-22', false, 'volunteer'),
       ('Lefèvre', 'Pierre', 3, '0708091011', 'p.lefevre@user.com', 'password', '1980-02-17', true, 'volunteer'),
       ('Moreau', 'Sophie', 4, '0809101112', 's.moreau@user.com', 'password', '1995-12-25', false, 'volunteer'),
       ('Dubois', 'Louis', 5, '0910111213', 'l.dubois@user.com', 'password', '1978-09-30', true, 'volunteer');

-- Données de test pour la table Skills
INSERT INTO Skills (Name, UseType)
VALUES ('Permis de conduire', TRUE),     -- Proposition
       ('Cuisine', TRUE),                -- Proposition
       ('Bricolage', FALSE),             -- Demande
       ('Conseils anti-gaspi', TRUE),    -- Proposition
       ('Gardiennage', FALSE),           -- Demande
       ('Services de réparation', FALSE),-- Demande
       ('Électricité', FALSE),           -- Demande
       ('Plomberie', FALSE),             -- Demande
       ('Jardinage', FALSE),             -- Demande
       ('Informatique', FALSE);          -- Demande


-- Données de test pour la table User_Skills
INSERT INTO User_Skills (User_ID, Skill_ID, Validation_Date, Document_Path)
VALUES (1, 1, '2024-08-25', '1.png'),
       (1, 2, NULL, '2.png'),
       (2, 3, NULL, '3.png'),
       (3, 4, NULL, '4.png'),
       (4, 5, NULL, '5.png'),
       (5, 6, NULL, '6.png');

-- Données de test pour la table Trucks
INSERT INTO Trucks (Registration, Capacity, Model, Conditions)
VALUES ('ABC123', 10, 'Renault', 2),
       ('DEF456', 15, 'Mercedes', 1),
       ('GHI789', 20, 'Iveco', 4),
       ('JKL012', 25, 'Volvo', 3),
       ('MNO345', 30, 'Scania', 1);

-- Données de test pour la table Subscriptions
INSERT INTO Subscriptions (User_ID, End_Date, Amount, Status)
VALUES (1, '2024-08-29', 9.99, true),
       (2, '2024-09-07', 9.99, false),
       (3, '2024-08-29', 9.99, true),
       (4, '2023-04-10', 9.99, false),
       (5, '2024-09-07', 9.99, true);

-- Données de test pour la table Schedules
INSERT INTO Schedules (User_ID, Date, Type)
VALUES (1, '2024-09-01', true),
       (2, '2024-09-02', false),
       (3, '2024-09-03', true),
       (4, '2024-09-04', false),
       (5, '2024-09-05', true);

-- Données de test pour la table Routes
INSERT INTO Routes (Date, Time, User_ID, Truck_ID, Type)
VALUES ('2024-09-01', '19:00', 1, 1, true),
       ('2024-09-02', '18:30', 2, 2, false),
       ('2024-09-03', '18:15', 3, 3, true),
       ('2024-09-04', '18:00', 4, 4, false),
       ('2024-09-05', '18:45', 5, 5, true);
INSERT INTO Routes (Date, Time, Truck_ID, Type)
VALUES ('2024-08-28', '19:00',  1, true),
       ('2024-08-13', '18:30',  2, false),
       ('2024-09-03', '18:15',  3, true),
       ('2024-09-04', '18:00',  4, false),
       ('2024-09-05', '18:45',  5, true);

-- Données de test pour la table Schedule_Routes
INSERT INTO Schedule_Routes (Schedule_ID, Route_ID)
VALUES (1, 1),
       (2, 2),
       (3, 3),
       (4, 4),
       (5, 5);

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
       ('Pizza garnie',
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


-- Mise à jour des données de test pour la table Tickets avec Start_Time et Skill_ID

INSERT INTO Tickets (Title, Direction, Start_Date, Start_Time, End_Of_Subscription, Duration, Places, Tools, Address_ID,
                     Address_needs, Customers_Address, Description, Image, Status_ID, Owner_User_ID, Skill_ID)
VALUES
-- Conseils anti-gaspi (proposition)
('Conseils anti-gaspi', true, '2024-09-01', '10:00:00', '2024-08-25', 90, 10, 'Livrets', NULL, false, NULL,
 'Atelier pour apprendre à réduire le gaspillage alimentaire.', '1.jpg', 1, 2, 4),  -- Skill_ID pour 'Conseils anti-gaspi'

-- Cours de cuisine (proposition)
('Cours de cuisine', true, '2024-09-05', '14:00:00', '2024-08-28', 120, 15, 'Couteaux, Ustensiles de cuisine', 2, false, NULL,
 'Cours pratique pour apprendre des recettes anti-gaspillage.', '2.jpg', 1, 3, 2),  -- Skill_ID pour 'Cuisine'

-- Partage de véhicules (proposition)
('Partage de véhicules', true, '2024-09-10', '09:00:00', '2024-09-03', 60, 5, 'Liste des véhicules disponibles', 3, true,
 'Parking central', 'Service de partage de véhicules pour réduire l\'empreinte carbone.', '3.jpg', 2, 4, 1),  -- Skill_ID pour 'Permis de conduire'

-- Échange de services entre particuliers (proposition)
('Échange de services entre particuliers', true, '2024-09-15', '15:30:00', '2024-09-07', 180, 20, 'Outils de bricolage', 4, true,
 'Chez le client', 'Échange de services comme le bricolage, l\'électricité, la plomberie.', '4.jpg', 1, 5, 3),  -- Skill_ID pour 'Bricolage'

-- Services de réparation (proposition)
('Services de réparation', true, '2024-09-20', '11:00:00', '2024-09-10', 180, 10, 'Outils de réparation', 5, true, 'Chez le client',
 'Proposition de services pour réparer des objets du quotidien.', '5.jpg', 2, 2, 6),  -- Skill_ID pour 'Services de réparation'

-- Gardiennage (proposition)
('Gardiennage', true, '2024-09-25', '13:00:00', '2024-09-15', 240, 5, 'Liste des contacts', 1, true, 'Adresse du client',
 'Service de gardiennage pour animaux ou biens.', '6.jpg', 1, 3, 5),  -- Skill_ID pour 'Gardiennage'

-- Demande de covoiturage (demande)
('Demande de covoiturage', false, '2024-09-05', '08:00:00', '2024-08-30', 60, 3, NULL, 2, true, 'Gare centrale',
 'Je recherche un covoiturage pour le trajet Paris-Lyon.', '7.jpg', 2, 4, 1),  -- Skill_ID pour 'Permis de conduire'

-- Demande de dépannage électrique (demande)
('Demande de dépannage électrique', false, '2024-09-10', '10:30:00', '2024-09-05', 120, 1, 'Outils d\'électricité', 3, true,
 'Appartement 45', 'Mon appartement a besoin d\'une réparation électrique urgente.', '8.jpg', 1, 5, 7),  -- Skill_ID pour 'Électricité'

-- Demande d'aide pour déménagement (demande)
('Demande d\'aide pour déménagement', false, '2024-09-20', '07:00:00', '2024-09-15', 480, 5, 'Camion, Cartons', 5, true,
 'Nouvelle adresse', 'Besoin d\'aide pour déménager des meubles lourds.', '10.jpg', 2, 2, 3),  -- Skill_ID pour 'Bricolage'

-- Demande de tutorat en informatique (demande)
('Demande de tutorat en informatique', false, '2024-09-25', '16:00:00', '2024-09-18', 120, 1, 'Ordinateur', 1, true, 'Chez moi',
 'Je recherche un tutorat pour apprendre les bases de l\'informatique.', '11.jpg', 1, 3, 10),  -- Skill_ID pour 'Informatique'

-- Demande de réparation de vélo (demande)
('Demande de réparation de vélo', false, '2024-09-30', '17:30:00', '2024-09-23', 90, 1, 'Outils de réparation', 2, true,
 'Mon garage', 'Mon vélo a besoin d\'être réparé, chaîne cassée.', '12.jpg', 2, 4, 6),  -- Skill_ID pour 'Services de réparation'

-- Demande de jardinage (demande)
('Demande de jardinage', false, '2024-10-01', '09:00:00', '2024-09-25', 180, 2, 'Outils de jardinage', 3, true, 'Mon jardin',
 'Je recherche de l\'aide pour l\'entretien de mon jardin.', '13.jpg', 1, 5, 9),  -- Skill_ID pour 'Jardinage'

-- Demande de covoiturage pour le weekend (demande)
('Demande de covoiturage pour le weekend', false, '2024-10-05', '15:00:00', '2024-09-30', 120, 3, NULL, 4, true,
 'Lieu de rendez-vous', 'Je cherche un covoiturage pour aller à la campagne ce weekend.', '14.jpg', 2, 1, 1),  -- Skill_ID pour 'Permis de conduire'

-- Demande de service de réparation d'électroménager (demande)
('Demande de réparation d\'électroménager', false, '2024-10-10', '11:00:00', '2024-10-05', 180, 1, 'Outils de réparation', 5, true,
 'Chez moi', 'Mon lave-linge est en panne, besoin de réparation.', '15.jpg', 1, 2, 6),  -- Skill_ID pour 'Services de réparation'

-- Demande de covoiturage pour un événement (demande)
('Demande de covoiturage pour un événement', false, '2024-11-01', '08:00:00', '2024-10-25', 120, 3, NULL, 2, true, 'Gare centrale',
 'Je cherche un covoiturage pour assister à un événement.', '16.jpg', 1, 4, 1),  -- Skill_ID pour 'Permis de conduire'

-- Demande d'aide pour le jardinage (demande)
('Demande d\'aide pour le jardinage', false, '2024-11-10', '10:30:00', '2024-11-02', 180, 2, 'Outils de jardinage', 4, true,
 'Mon jardin', 'Besoin d\'aide pour entretenir un grand jardin.', '18.jpg', 1, 2, 9);  -- Skill_ID pour 'Jardinage'


INSERT INTO Ticket_Users (Ticket_ID, User_ID)
VALUES
-- Participants pour "Conseils anti-gaspi"
(1, 2),
(1, 3),
(1, 4),

-- Participants pour "Cours de cuisine"
(2, 3),
(2, 4),
(2, 5),

-- Participants pour "Partage de véhicules"
(3, 4),
(3, 5),
(3, 1),

-- Participants pour "Échange de services entre particuliers"
(4, 5),
(4, 1),
(4, 2),

-- Participants pour "Services de réparation"
(5, 2),
(5, 3),
(5, 4),

-- Participants pour "Gardiennage"
(6, 3),
(6, 4),
(6, 5),

-- Participants pour "Demande de covoiturage"
(7, 1),
(7, 2),

-- Participants pour "Demande de dépannage électrique"
(8, 3),
(8, 4),

-- Participants pour "Demande de baby-sitting"
(9, 5),
(9, 1),

-- Participants pour "Demande d'aide pour déménagement"
(10, 2),
(10, 3),

-- Participants pour "Demande de tutorat en informatique"
(11, 4),
(11, 5),

-- Participants pour "Demande de réparation de vélo"
(12, 1),
(12, 3),

-- Participants pour "Demande de jardinage"
(13, 2),
(13, 4),

-- Participants pour "Demande de covoiturage pour le weekend"
(14, 5),
(14, 1),

-- Participants pour "Demande de service de réparation d'électroménager"
(15, 2),
(15, 3);
