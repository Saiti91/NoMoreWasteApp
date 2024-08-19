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
    Validation_Date DATE,
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
    User_ID  INT,
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
    Zone       VARCHAR(100),
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Requests
(
    Request_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT,
    Quantity   INT,
    Date       DATE,
    User_ID    INT,
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
    FOREIGN KEY (Donor_User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE     -- If the user is deleted, delete the donation
);

CREATE TABLE IF NOT EXISTS SkillsCategories
(
    Category_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name        VARCHAR(100),
    Skill_ID    INT,
    FOREIGN KEY (Skill_ID) REFERENCES Skills (Skill_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Category_Skills
(
    Category_ID INT,
    Skill_ID    INT,
    FOREIGN KEY (Category_ID) REFERENCES SkillsCategories (Category_ID) ON DELETE CASCADE,
    FOREIGN KEY (Skill_ID) REFERENCES Skills (Skill_ID) ON DELETE CASCADE,
    PRIMARY KEY (Category_ID, Skill_ID)
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
    Category_ID       INT,
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
    FOREIGN KEY (Category_ID) REFERENCES SkillsCategories (Category_ID) ON DELETE CASCADE,
    FOREIGN KEY (Address_ID) REFERENCES Address (Address_ID),
    FOREIGN KEY (Status_ID) REFERENCES Statuses (Status_ID),
    FOREIGN KEY (Owner_User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE
);

-- Fin des tickets

## 2.2.2. Insertion of data

-- Données de test pour la table Address
INSERT INTO Address (Street, City, State, Postal_Code, Country)
VALUES ('123 Rue de la Paix', 'Paris', 'Ile-de-France', '75001', 'France'),
       ('456 Avenue des Champs-Elysées', 'Paris', 'Ile-de-France', '75008', 'France'),
       ('789 Boulevard Saint-Germain', 'Paris', 'Ile-de-France', '75006', 'France'),
       ('1011 Rue de Rivoli', 'Paris', 'Ile-de-France', '75004', 'France'),
       ('1213 Rue du Bac', 'Paris', 'Ile-de-France', '75007', 'France');

-- Données de test pour la table ProductCategories
INSERT INTO ProductsCategories (Name, StorageSector)
VALUES ('Fruits et Legumes', 'A1'),
       ('Viandes et Poissons', 'A2'),
       ('Pains et Pâtisseries', 'A3'),
       ('Cremerie et Produits laitiers', 'A4'),
       ('Charcuterie et Traiteur', 'A5'),
       ('Surgeles', 'B1'),
       ('Boissons', 'B2'),
       ('Epicerie salée', 'B3'),
       ('Epicerie sucrée', 'B4'),
       ('Produits du monde', 'B5'),
       ('Nutrition et Vegetale', 'C1'),
       ('Bebe', 'C2'),
       ('Entretien et Nettoyage', 'C3'),
       ('Hygiene et Beaute', 'C4'),
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

-- Epicerie salée (Category_ID = 8)
('8234567890123', 'Pâtes', 8),
('8234567890124', 'Riz', 8),
('8234567890125', 'Conserve de tomates', 8),
('8234567890126', 'Huile d\'olive', 8),
('8234567890127', 'Sel', 8),

-- Epicerie sucrée (Category_ID = 9)
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
       ('Lefevre', 'Pierre', 3, '0708091011', 'p.lefevre@user.com', 'password', '1980-02-17', true, 'volunteer'),
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
INSERT INTO Stocks (Product_ID, Quantity, Zone)
VALUES (1, 1000, 'A1'),
       (1, 2000, 'A2'),
       (2, 2000, 'B2'),
       (3, 3000, 'C3'),
       (4, 4000, 'D1'),
       (5, 5000, 'A3');

-- Données de test pour la table Requests
INSERT INTO Requests (Product_ID, Quantity, Date, User_ID)
VALUES (1, 10, '2023-10-01', 1),
       (2, 20, '2023-10-02', 2),
       (3, 30, '2023-10-03', 3),
       (4, 40, '2023-10-04', 4),
       (5, 50, '2023-10-05', 5);

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
VALUES ('Inscription_Ouverte'),
       ('Inscription_fermée'),
       ('Terminé');

INSERT INTO SkillsCategories (Name, Skill_ID)
VALUES ('Plomberie', 1),
       ('Electricite', 2),
       ('Maçonnerie', 3),
       ('Peinture', 4),
       ('Jardinage', 5);


-- Associer des compétences aux catégories
INSERT INTO Category_Skills (Category_ID, Skill_ID)
VALUES (1, 8), -- Plomberie avec Plomberie
       (1, 7), -- Plomberie avec Electricité
       (1, 3), -- Plomberie avec Bricolage
       (2, 7), -- Électricité avec Electricité
       (2, 6), -- Électricité avec Services de réparation
       (3, 3), -- Maçonnerie avec Bricolage
       (4, 4), -- Peinture avec Conseils anti-gaspi
       (5, 9); -- Jardinage avec Jardinage

