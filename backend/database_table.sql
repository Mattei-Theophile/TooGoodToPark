
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
DROP TABLE IF EXISTS Car_Unavailability;
DROP TABLE IF EXISTS Active_Rentals;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS Review;

DROP TABLE IF EXISTS Car;
DROP TABLE IF EXISTS Settings;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Role;


-- auto-generated definition
create table Client
(
    ID_Client          bigint auto_increment
        primary key,
    Surname_Client     varchar(50)                        not null,
    Name_Client        varchar(50)                        not null,
    Email_Client       varchar(70)                        not null,
    PhoneNumber_Client varchar(50)                        not null,
    Password_Client    varchar(100)                       not null,
    Is_Active          tinyint  default 1                 null,
    Created_At         datetime default CURRENT_TIMESTAMP null,
    Updated_At         datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    Address_Client     varchar(100)                       null,
    ZipCode_Client     varchar(20)                        null,
    City_Client        varchar(50)                        null,
    Country_Client     varchar(50)                        null,
    constraint Email_Client
        unique (Email_Client)
);

-- auto-generated definition
create table Car
(
    ID_Car           bigint auto_increment
        primary key,
    ID_Seller        bigint                                                                not null,
    Brand_Car        varchar(50)                                                           not null,
    Model_Car        varchar(50)                                                           not null,
    Year_Car         smallint                                                              not null,
    Mileage_Car      int                                                                   not null,
    Description_Car  text                                                                  null,
    Price_Car        smallint                                                              not null,
    Created_At       datetime                                    default CURRENT_TIMESTAMP null,
    Updated_At       datetime                                    default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    Location_Car     varchar(50)                                                           null,
    LicensePlate_Car varchar(20)                                                           not null,
    Passenger_Car    smallint                                                              not null,
    Status_Car       enum ('available', 'rented', 'unavailable') default 'unavailable'     null,
    constraint Car_ibfk_1
        foreign key (ID_Seller) references Client (ID_Client)
            on delete cascade
);



-- auto-generated definition
create table Car_Images
(
    ID_Image          bigint auto_increment
        primary key,
    ID_Car            bigint                                                                                                                            not null,
    Image_Path        varchar(500)                                                                                                                      not null,
    Image_Name        varchar(255)                                                                                                                      null,
    Original_Name     varchar(255)                                                                                                                      null,
    Image_Type        enum ('exterior', 'interior', 'engine', 'dashboard', 'trunk', 'wheels', 'damage', 'documents', 'other') default 'other'           null,
    Image_Description text                                                                                                                              null,
    Image_Size        int                                                                                                                               null,
    Image_Width       smallint                                                                                                                          null,
    Image_Height      smallint                                                                                                                          null,
    Image_Format      enum ('jpg', 'jpeg', 'png', 'webp', 'gif')                                                              default 'jpg'             null,
    Display_Order     smallint                                                                                                default 0                 null,
    Is_Primary        tinyint                                                                                                 default 0                 null,
    Is_Active         tinyint                                                                                                 default 1                 null,
    Uploaded_By       bigint                                                                                                                            null,
    Alt_Text          varchar(255)                                                                                                                      null,
    Created_At        datetime                                                                                                default CURRENT_TIMESTAMP null,
    Updated_At        datetime                                                                                                default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint Car_Images_ibfk_1
        foreign key (ID_Car) references Car (ID_Car)
            on delete cascade,
    constraint Car_Images_ibfk_2
        foreign key (Uploaded_By) references Client (ID_Client)
            on delete set null
);




-- auto-generated definition
create table reservations
(
    ID_Reservation         bigint auto_increment
        primary key,
    ID_Client              bigint                                                                                  not null,
    ID_Car                 bigint                                                                                  not null,
    Price_Reservation      int                                                                                     not null,
    Status                 enum ('available', 'reserved', 'active', 'rented', 'blocked') default 'available'       null,
    Date_Start_Reservation datetime                                                      default CURRENT_TIMESTAMP null,
    location_reservation   int                                                                                     null,
    Date_End_Reservation   datetime                                                      default (now())           not null,
    Created_At             datetime                                                      default CURRENT_TIMESTAMP null,
    Updated_At             datetime                                                      default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint unique_car_date_time
        unique (ID_Car, Date_Start_Reservation, Date_End_Reservation),
    constraint reservations_ibfk_1
        foreign key (ID_Client) references Client (ID_Client)
            on delete cascade,
    constraint reservations_ibfk_2
        foreign key (ID_Car) references Car (ID_Car)
            on delete cascade
);


-- auto-generated definition
create table Review
(
    ID_Review          bigint auto_increment
        primary key,
    ID_client          bigint                             not null,
    ID_car             bigint                             not null,
    Note_Review        smallint                           not null,
    Commentaire_Review text                               null,
    Created_At         datetime default CURRENT_TIMESTAMP null,
    constraint Review_ibfk_1
        foreign key (ID_client) references Client (ID_Client)
            on delete cascade,
    constraint Review_ibfk_2
        foreign key (ID_car) references Car (ID_Car)
            on delete cascade
);


-- auto-generated definition
create table Settings
(
    ID_Setting            bigint auto_increment
        primary key,
    ID_Client             bigint                             null,
    TwoFactorAuth         tinyint  default 0                 null,
    RememberMe            tinyint  default 0                 null,
    experimentalFeatures  tinyint  default 0                 null,
    NotificationEmail     tinyint  default 0                 null,
    NotificationSMS       tinyint  default 0                 null,
    NotificationPush      tinyint  default 0                 null,
    NotificationMarketing tinyint  default 0                 null,
    Created_At            datetime default CURRENT_TIMESTAMP null,
    Updated_At            datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint Settings_ibfk_1
        foreign key (ID_Client) references Client (ID_Client)
            on delete set null
);

create index idx_client_active on Client (Is_Active);
create index idx_client_email on Client (Email_Client);
create index ID_Client on reservations (ID_Client);
create index ID_car on Review (ID_car);
create index ID_client on Review (ID_client);
create index ID_Client on Settings (ID_Client);
create index idx_car_images_active on Car_Images (Is_Active);
create index idx_car_images_car on Car_Images (ID_Car);
create index idx_car_images_order on Car_Images (ID_Car, Display_Order);
create index idx_car_images_primary on Car_Images (ID_Car, Is_Primary);
create index idx_car_images_type on Car_Images (Image_Type);
create index idx_car_images_uploader on Car_Images (Uploaded_By);
create index ID_Seller on Car (ID_Seller);
