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
 is_admin boolean,
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
  subject varchar(20),
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


/*
========================================================================================================================
========================================== Done with table creation stuff :) ===========================================
========================================================================================================================
*/

/*
----------------------------------------------------------------
-------------------- ADDING SOME DUMMY DATA --------------------
----------------------------------------------------------------
*/


/*
-------------------- CREATING FAKE CUSTOMERS --------------------
*/

INSERT INTO customer
VALUES (4, 'Ben', 'Jahova', '998-124-6745', 'Outside bro lol');

INSERT INTO customer
VALUES (5, 'Gert', 'Fert', '707-455-1111', 'The bathroom');

INSERT INTO customer
VALUES (6, 'Matt', 'Mathews', '707-123-4567', 'Cypress');

/*
-------------------- CREATING FAKE TECHNICIANS --------------------
*/

INSERT INTO technicians
VALUES (0, 'Erik', 'Andre', true);

INSERT INTO technicians
VALUES (1, 'Mike', 'Roch', false);

INSERT INTO technicians
VALUES (2, 'Steve', 'Buschemi', false);

/*
-------------------- CREATING FAKE TICKETS --------------------
*/

set @stamp := TIMESTAMP("2019-10-20", "05:09:32");
set @stamp2 := TIMESTAMP("2019-10-22", "02:11:02");
INSERT INTO ticket
VALUES (112, 'Pener broke', 4, 1, 'Humped a rock now pee pee broke', 'o', 69, @stamp, @stamp2);

set @stamp := TIMESTAMP("2017-05-10", " 00:00:6");
INSERT INTO ticket
VALUES (113, 'Ho w t2o wifi???', 5, 2, 'WIFI????????? HOW?????????????', 'o', 1051200, @stamp, NULL);

INSERT INTO ticket
VALUES (111, 'PS4 needs Spaghetti', 6, 0, 'I need to feed my baby spaghet, but I cannot. HALP', 'w', 20, current_timestamp(), NULL);


/*
-------------------- CREATING FAKE DEVICES --------------------
*/

INSERT INTO devices
VALUES (1, 00000000000000000001, 'Playstation 4', '2014-05-12');

INSERT INTO devices
VALUES (2, 00000000000000000002, 'Pener', '1980-11-20');

INSERT INTO devices
VALUES (3, 00000000000000000003, 'MacBook Pro', '1400-09-30');

/*
-------------------- CREATING FAKE COMMENTS --------------------
*/

set @stamp := TIMESTAMP("2019-10-21", "07:11:15");
INSERT INTO comments
VALUES (0, 112, 1, @stamp, NULL, 'wtf bro go to a hospital');

set @stamp := TIMESTAMP("2019-05-10", " 00:00:7");
INSERT INTO comments
VALUES (1, 113, 2, @stamp, NULL, 'Working on this dude\'\s wifi for about 2 years fml');

set @stamp := TIMESTAMP("2019-05-10", " 00:00:7");
INSERT INTO comments
VALUES (2, 111, 0, CURRENT_TIMESTAMP()+5, NULL, 'fucked his mom and now we good');

/*
-------------------- CREATING FAKE LINKED-DEVICES --------------------
*/

INSERT INTO linked_devices
VALUES (11, 112, 2);

INSERT INTO linked_devices
VALUES (12, 113, 3);

INSERT INTO linked_devices
VALUES (13, 111, 1);

/*
-------------------- CREATING FAKE LINKED-TICKETS --------------------
*/

INSERT INTO linked_ticket
VALUES (1, 112, 113);

/*
How/why above linked? bcuz both retardo...
*/
