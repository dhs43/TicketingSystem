use ticket_system;
SET FOREIGN_KEY_CHECKS = 0;
/*
SET SQL_SAFE_UPDATES = 0;
*/


/*
-------------------- CREATING THE CUSTOMER TABLE --------------------
*/

DROP TABLE customer;

CREATE TABLE customer
(
 customer_ID varchar(55),
 first_name varchar(25),
 last_name varchar(25),
 phone_number char(12),
 location varchar(15),
 PRIMARY KEY (customer_ID)
);

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
  FOREIGN KEY (customer_ID) REFERENCES customer(customer_ID),
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
