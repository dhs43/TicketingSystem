/*
========================================================================================================================
==================================================== Ticket Queries ====================================================
========================================================================================================================
*/


/*
View all tickets that are open
*/

SELECT ticket_ID, subject, customer_ID, assigned_technician_ID, description, time_spent, time_submitted
FROM ticket
WHERE status = 'o';

/*
View all tickets that are closed
*/

SELECT ticket_ID, subject, customer_ID, assigned_technician_ID, description, time_spent, time_submitted, time_closed
FROM ticket
WHERE status = 'c';

/*
View all tickets that are waiting
*/

SELECT ticket_ID, subject, customer_ID, assigned_technician_ID, description, time_spent, time_submitted
FROM ticket
WHERE status = 'w';

/*
View all tickets and their customers
*/

SELECT ticket.customer_ID, first_name, last_name, phone_number, subject, ticket_ID, location
FROM ticket, customer
WHERE ticket.customer_ID = customer.customer_ID;