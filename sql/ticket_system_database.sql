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
 customer_ID int,
 first_name varchar(15),
 last_name varchar(15),
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
 technician_ID int,
 first_name varchar(15),
 last_name varchar(15),
 PRIMARY KEY (technician_ID)
);

/*
-------------------- CREATING THE DEVICES TABLE --------------------
*/

DROP TABLE devices;

CREATE TABLE devices
(
 device_ID int,
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
  ticket_ID int,
  subject varchar(10),
  customer_ID int,
  assigned_technician_ID int,
  description varchar(55),
  status char(1),
  time_spent int,
  time_submitted timestamp,
  time_closed timestamp,
  FOREIGN KEY (customer_ID) REFERENCES customer(customer_ID),
  PRIMARY KEY (ticket_ID)
);

/*

-status can be of 3 values: o(open), c(closed), or w(waiting)
-time_spent is the time in minutes spent

*/

/*
-------------------- CREATING THE COMMENTS TABLE --------------------
*/

DROP TABLE comments;

CREATE TABLE comments
(
 comment_ID int,
 ticket_ID int,
 technician_ID int,
 creation_date timestamp,
 last_edited timestamp,
 text varchar(55),
 FOREIGN KEY (ticket_ID) REFERENCES ticket(ticket_ID),
 FOREIGN KEY (technician_ID) REFERENCES technicians(technician_ID),
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
  linked_ticket_ID int,
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
  linked_device_ID int,
  ticket_ID int,
  device_ID int,
  FOREIGN KEY(ticket_ID) REFERENCES ticket(ticket_ID),
  FOREIGN KEY(device_ID) REFERENCES devices(device_ID),
  PRIMARY KEY(linked_device_ID)
);

SET FOREIGN_KEY_CHECKS = 1;

