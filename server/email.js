const MailListener = require("mail-listener2");
const getConnection = require('./db');

var mailListener = new MailListener({
    username: "hsuhelpdeskproject@gmail.com",
    password: process.env.EMAIL_PASSWORD,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    connTimeout: 10000,
    authTimeout: 5000,
    // debug: console.log,
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX",
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function () {
    console.log("imapConnected");
});

mailListener.on("server:disconnected", function () {
    console.log("imapDisconnected");
});

mailListener.on("error", function (err) {
    console.log(err);
});

mailListener.on("mail", function (mail, seqno, attributes) {
    // do something with mail object including attachments
    var subject = mail.subject;
    var ticket_ID = subject.slice(21); // Format should be: ResNet - Ticket #1234
    var author_ID = mail.from[0].address;
    var text = mail.text;
    var clean_text = '';

    // Remove quoted email from replies
    var splitText = text.split(/\r?\n/);
    for (var i = 0; i < splitText.length; i++) {
        if (splitText[i].includes("<hsuhelpdeskproject@gmail.com> wrote:") === false) {
            clean_text += splitText[i] + '\n';
        } else {
            break;
        }
    }

    // Before inserting a new comment, ensure the person emailing is the original author of the ticket
    var customerStatement = "SELECT customer_ID FROM ticket WHERE ticket_ID = " + ticket_ID + ";";
    getConnection(function (err, connection) {
        connection.query(customerStatement, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result[0].customer_ID === author_ID) {

                    // Get name from customer_ID
                    var nameStatement = "SELECT * FROM customer WHERE customer_ID = \"" + author_ID + "\";";
                    getConnection(function (err, authorConnection) {
                        authorConnection.query(nameStatement, function (err, authorResult) {
                            if (err) {
                                console.log(err);
                            } else {
                                var author_name = authorResult[0].first_name + ' ' + authorResult[0].last_name;

                                date = new Date();
                                var commentStatement = "INSERT INTO comments \
                                                 (ticket_ID, author_ID, creation_date, text, internal, author_name) \
                                                 VALUES \
                                                 (\"" + ticket_ID + "\", \"" + author_ID + "\", \"" + date.getTime() / 1000 + "\", \"" + clean_text + "\", false, \"" + author_name + "\");"

                                getConnection(function (err, insertConnection) {
                                    insertConnection.query(commentStatement, function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            console.log("Comment creation failed from email " + author_ID);
                                        } else {
                                            console.log("Comment created from email " + author_ID);
                                        }
                                    });
                                    insertConnection.release();
                                });
                            }
                        });
                        authorConnection.release();
                    });
                } else {
                    console.log("Email sender does not match ticket author.");
                }
            }
        });
        connection.release();
    });
});

mailListener.on("attachment", function (attachment) {
    console.log(attachment.path);
});