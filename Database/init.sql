CREATE TABLE Address (
                         Address_ID INT AUTO_INCREMENT PRIMARY KEY,
                         Street VARCHAR(255),
                         City VARCHAR(100),
                         State VARCHAR(100),
                         Postal_Code VARCHAR(20),
                         Country VARCHAR(100)
);

CREATE TABLE User (
                      ID INT AUTO_INCREMENT PRIMARY KEY,
                      Name VARCHAR(100),
                      Firstname VARCHAR(100),
                      Address_ID INT,
                      Tel VARCHAR(20),
                      Email VARCHAR(255),
                      Password VARCHAR(255),
                      Birthdate DATE,
                      Cotisation_En_Cours BOOLEAN,
                      FOREIGN KEY (Address_ID) REFERENCES Address(Address_ID)
);

CREATE TABLE Capacite (
                          Capacite_ID INT AUTO_INCREMENT PRIMARY KEY,
                          Nom VARCHAR(100)
);

CREATE TABLE User_Capacite (
                               User_ID INT,
                               Capacite_ID INT,
                               Date_Validation DATE,
                               PRIMARY KEY (User_ID, Capacite_ID),
                               FOREIGN KEY (User_ID) REFERENCES User(ID),
                               FOREIGN KEY (Capacite_ID) REFERENCES Capacite(Capacite_ID)
);

CREATE TABLE Cotisations (
                             User_ID INT,
                             Date_De_Paiement DATE,
                             Montant DECIMAL(10, 2),
                             Status BOOLEAN, -- true for 'paid', false for 'pending'
                             PRIMARY KEY (User_ID, Date_De_Paiement),
                             FOREIGN KEY (User_ID) REFERENCES User(ID)
);

CREATE TABLE Planning (
                          Planning_ID INT AUTO_INCREMENT PRIMARY KEY,
                          User_ID INT,
                          Date DATE,
                          Type BOOLEAN, -- true for 'collect', false for 'distrib'
                          FOREIGN KEY (User_ID) REFERENCES User(ID)
);

CREATE TABLE Tournees (
                          Tournee_ID INT AUTO_INCREMENT PRIMARY KEY,
                          Date DATE,
                          User_ID INT,
                          Camion_ID INT,
                          Type BOOLEAN, -- true for 'collect', false for 'distrib'
                          FOREIGN KEY (User_ID) REFERENCES User(ID),
                          FOREIGN KEY (Camion_ID) REFERENCES Camions(Camion_ID)
);

CREATE TABLE Planning_Tournees (
                                   Planning_ID INT,
                                   Tournee_ID INT,
                                   PRIMARY KEY (Planning_ID, Tournee_ID),
                                   FOREIGN KEY (Planning_ID) REFERENCES Planning(Planning_ID),
                                   FOREIGN KEY (Tournee_ID) REFERENCES Tournees(Tournee_ID)
);

CREATE TABLE Tournees_Dons (
                               Tournees_ID INT,
                               Date DATE,
                               PRIMARY KEY (Tournees_ID),
                               FOREIGN KEY (Tournees_ID) REFERENCES Tournees(Tournee_ID)
);

CREATE TABLE Destinations (
                              Destination_ID INT AUTO_INCREMENT PRIMARY KEY,
                              Tournees_ID INT,
                              Address_ID INT,
                              Type BOOLEAN, -- true for 'collect', false for 'distrib'
                              FOREIGN KEY (Tournees_ID) REFERENCES Tournees(Tournee_ID),
                              FOREIGN KEY (Address_ID) REFERENCES Address(Address_ID)
);

CREATE TABLE Destinations_Produit (
                                      Destination_ID INT,
                                      Produit_ID INT,
                                      Quantity INT,
                                      PRIMARY KEY (Destination_ID, Produit_ID),
                                      FOREIGN KEY (Destination_ID) REFERENCES Destinations(Destination_ID),
                                      FOREIGN KEY (Produit_ID) REFERENCES Produits(Produit_ID)
);

CREATE TABLE Stocks (
                        Produit_ID INT,
                        Quantity INT,
                        Date_Stockage DATE,
                        PRIMARY KEY (Produit_ID),
                        FOREIGN KEY (Produit_ID) REFERENCES Produits(Produit_ID)
);

CREATE TABLE Demande (
                         Produit_ID INT,
                         Quantity INT,
                         Date DATE,
                         User_ID INT,
                         PRIMARY KEY (Produit_ID, User_ID, Date),
                         FOREIGN KEY (Produit_ID) REFERENCES Produits(Produit_ID),
                         FOREIGN KEY (User_ID) REFERENCES User(ID)
);

CREATE TABLE Dons (
                      Produit_ID INT,
                      Quantity INT,
                      Donation_User_ID INT,
                      User_ID INT,
                      PRIMARY KEY (Produit_ID, Donation_User_ID),
                      FOREIGN KEY (Produit_ID) REFERENCES Produits(Produit_ID),
                      FOREIGN KEY (Donation_User_ID) REFERENCES User(ID),
                      FOREIGN KEY (User_ID) REFERENCES User(ID)
);

CREATE TABLE Produits (
                          Produit_ID INT AUTO_INCREMENT PRIMARY KEY,
                          CodeBarre VARCHAR(50),
                          Nom VARCHAR(100),
                          Type_De_Stockage VARCHAR(100),
                          Date_De_Peremption DATE
);

CREATE TABLE Camions (
                         Camion_ID INT AUTO_INCREMENT PRIMARY KEY,
                         Immatriculation VARCHAR(50),
                         Capacite INT,
                         Modele VARCHAR(100),
                         Etat VARCHAR(100)
);
