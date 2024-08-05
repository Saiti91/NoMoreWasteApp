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
    Product_ID         INT AUTO_INCREMENT PRIMARY KEY,
    Barcode            VARCHAR(50),
    Name               VARCHAR(100),
    Storage_Type       VARCHAR(100),
    Expiration_Date    DATE
);

CREATE TABLE IF NOT EXISTS Users
(
    User_ID             INT AUTO_INCREMENT PRIMARY KEY,
    Name                VARCHAR(100),
    Firstname           VARCHAR(100),
    Address_ID          INT,
    Phone               VARCHAR(20),
    Email               VARCHAR(255),
    Password            VARCHAR(255),
    Birthdate           DATE,
    Current_Subscription BOOLEAN,
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
    Truck_ID         INT AUTO_INCREMENT PRIMARY KEY,
    Registration     VARCHAR(50),
    Capacity         INT,
    Model            VARCHAR(100),
    Conditions       VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Subscriptions
(
    User_ID           INT,
    Payment_Date      DATE,
    Amount            DECIMAL(10, 2),
    Status            BOOLEAN, -- true for 'paid', false for 'pending'
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
    Route_ID   INT AUTO_INCREMENT PRIMARY KEY,
    Date       DATE,
    User_ID    INT,
    Truck_ID   INT,
    Type       BOOLEAN, -- true for 'collect', false for 'distribute'
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
    Route_ID   INT,
    Date       DATE,
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
    Destination_ID INT,
    Product_ID     INT,
    Quantity       INT,
    PRIMARY KEY (Destination_ID, Product_ID),
    FOREIGN KEY (Destination_ID) REFERENCES Destinations (Destination_ID),
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID)
);

CREATE TABLE IF NOT EXISTS Stocks
(
    Product_ID    INT,
    Quantity      INT,
    Storage_Date  DATE,
    PRIMARY KEY (Product_ID),
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID)
);

CREATE TABLE IF NOT EXISTS Requests
(
    Product_ID INT,
    Quantity   INT,
    Date       DATE,
    User_ID    INT,
    PRIMARY KEY (Product_ID, User_ID, Date),
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID),
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID)
);

CREATE TABLE IF NOT EXISTS Donations
(
    Product_ID       INT,
    Quantity         INT,
    Donor_User_ID    INT,
    Recipient_User_ID INT,
    PRIMARY KEY (Product_ID, Donor_User_ID),
    FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID),
    FOREIGN KEY (Donor_User_ID) REFERENCES Users (User_ID),
    FOREIGN KEY (Recipient_User_ID) REFERENCES Users (User_ID)
);




