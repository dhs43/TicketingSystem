use ticket_system;
SET FOREIGN_KEY_CHECKS = 0;
/*
SET SQL_SAFE_UPDATES = 0;
*/


/*
-------------------- CREATING THE TECHNICIAN TABLE --------------------
*/

DROP TABLE technicians;

CREATE TABLE technicians
(
 technician_ID varchar(55),
 first_name varchar(25),
 last_name varchar(25),
 is_admin boolean,
 password varchar(95),
 active_user boolean,
 PRIMARY KEY (technician_ID)
);

/*
-------------------- CREATING THE DEVICES TABLE --------------------
*/

DROP TABLE devices;

CREATE TABLE devices
(
 device_ID int auto_increment NOT NULL,
 serial_number varchar(20),
 model varchar(15),
 date_purchased date,
 PRIMARY KEY (device_ID)
);

/*
-------------------- CREATING THE TICKET TABLE --------------------
*/

DROP TABLE ticket;

CREATE TABLE ticket
( 
  ticket_ID int auto_increment NOT NULL,
  subject varchar(100),
  customer_ID varchar(55),
  customer_name varchar(51),
  assigned_technician varchar(51),
  description text,
  status varchar(7), --open, closed, waiting
  time_spent int, --time in seconds
  time_submitted int, --time in seconds 
  time_closed int, --time in seconds
  location varchar(55),
  severity varchar(6), --low, medium, high
  phone_number char(12),
  KEY customer_ID (customer_ID),
  PRIMARY KEY (ticket_ID)
);

/*
-------------------- CREATING THE COMMENTS TABLE --------------------
*/

DROP TABLE comments;

CREATE TABLE comments
(
 comment_ID int auto_increment NOT NULL,
 ticket_ID int,
 author_ID varchar(55),
 creation_date int,
 last_edited int,
 internal boolean,
 author_name varchar(51),
 text text,
 FOREIGN KEY (ticket_ID) REFERENCES ticket(ticket_ID),
 PRIMARY KEY (comment_ID)
);

/*

-technician_ID is the author

*/

/*
-------------------- CREATING THE LINKED_TICKET TABLE --------------------
*/

DROP TABLE linked_ticket;

CREATE TABLE linked_ticket
( 
  linked_ticket_ID int auto_increment NOT NULL,
  ticket_a_ID int,
  ticket_b_ID int,
  FOREIGN KEY(ticket_a_ID) REFERENCES ticket(ticket_ID),
  FOREIGN KEY(ticket_b_ID) REFERENCES ticket(ticket_ID),
  PRIMARY KEY(linked_ticket_ID)
);

/*
-------------------- CREATING THE LINKED_DEVICES TABLE --------------------
*/

DROP TABLE linked_devices;

CREATE TABLE linked_devices
( 
  linked_device_ID int auto_increment NOT NULL,
  ticket_ID int,
  device_ID int,
  FOREIGN KEY(ticket_ID) REFERENCES ticket(ticket_ID),
  FOREIGN KEY(device_ID) REFERENCES devices(device_ID),
  PRIMARY KEY(linked_device_ID)
);

SET FOREIGN_KEY_CHECKS = 1;


/*
-------------------- CREATING THE ACTIVITY TABLE --------------------
*/

DROP TABLE activity;

CREATE TABLE activity
(
    technician_ID varchar(55) NOT NULL,
    ticket_ID int NOT NULL,
    last_seen_comment_ID int,
    FOREIGN KEY(technician_ID) REFERENCES technicians(technician_ID),
    FOREIGN KEY(last_seen_comment_ID) REFERENCES comments(comment_ID),
    PRIMARY KEY(technician_ID, ticket_ID)
);