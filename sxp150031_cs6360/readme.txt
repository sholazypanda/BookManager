***************************************************
*	Name: Shobhika Panda    *	
*	Net ID: sxp150031       *		
*	Spring, 2016            *
*	Database Design		    *
***************************************************

Library Management System::


Operating System : IOS

Technical Dependencies on Node.js
as given by package.JSON
Versions of MYSQL used by node is 2.5.4
{
  "name": "website-using-express",
  "version": "0.0.1",
  "scripts": {
    "start": "node Server.js"
  },
  "dependencies": {
    "body-parser": "^1.15.0",
    "cookie-parser": "^1.4.1",
    "express": "latest",
    "multer": "^1.1.0",
    "mysql": "^2.5.4"
  }
}


To make the database:
	
	Create all tables with the given schema in the Design Document.Write all create queries.
	Use Library package of java to insert all data into the tables.

// create tables
CREATE TABLE book(
   ISBN  VARCHAR(10)  NOT NULL,
   TITLE VARCHAR(40)  NOT NULL,
   PRIMARY KEY (ISBN)
);

CREATE TABLE authors(
author_id  VARCHAR(10)  NOT NULL,
fullname VARCHAR(40)  NOT NULL,
title VARCHAR(10)  NOT NULL,
fname VARCHAR(40),
mname VARCHAR(40),
lname VARCHAR(40),
suffix VARCHAR(10),
   PRIMARY KEY (author_id)
);

create table book_authors(
isbn varchar(10) not null,
author_id varchar(10) not null,
primary key(isbn,author_id)
);

create table book_copies(
book_id varchar(10) not null,
branch_id varchar(5) not null,
no_of_copies number(10),
primary key(book_id,branch_id));

create table library_branch(
branch_id varchar(5) not null,
branch_name varchar(10) not null,
address varchar(120),
primary key(branch_id));

create table borrowers(
card_no varchar(10) not null,
ssn varchar(11) not null,
fname varchar(40),
lname varchar(40),
email varchar(50),
address varchar(120),
city varchar(50),
state varchar(50),
phone varchar(50),
primary key(card_no));

create table book_loans(
loan_id varchar(10) not null,
isbn varchar(10) not null,
branch_id varchar(5),
card_no varchar(10),
date_out varchar(10),
due_date varchar(10),
date_in varchar(10),
primary key(loan_id));

create table fines(
loan_id varchar(10) not null,
fine_amt decimal(10,2),
paid BIT(1),
primary key(loan_id)
);

// alter tables and add constraints
alter table book_loans add constraint fk_bl_isbn foreign key(isbn) references book(isbn);

alter table book_loans add constraint fk_bl_branch_id foreign key (branch_id) references library_branch(branch_id);

alter table book_loans add constraint fk_bl_card_no foreign key (card_no) references borrowers(card_no);

alter table book_copies add constraint fk_bc_book_id foreign key (book_id) references book(isbn);

alter table book_copies add constraint fk_bc_branch_id foreign key (branch_id) references library_branch(branch_id);

alter table book_authors add constraint fk_ba_author_id foreign key (author_id) references authors(author_id);

alter table book_authors add constraint fk_ba_isbn foreign key (isbn) references book(isbn);


Folder structure for JAVA files:
	Library
		-BookLoans.java // Insert into book_loans table from the csv file book_loans.csv.
		-CreateBorrowerTable.java // insert into borrower table
		-CreateLibraryBranch.java // insert into library_branch table
		-CreateOtherTables.java // insert into book_copies
		-CreateTables.java // create book,book_authors, authors

Folder Struture for Node.js:
	Node
		- node_modules/
			-body-parser
			-cookie-parser
			-express
			-mysql
			-multer
		- routes/
			-db_connect.js
			-dBborrower.js
			-dBCheckin.js
			-dbCalculateFine.js
			-dbupdateFine.js
			-dbAddBorrower.js
		- views/index.html
		- public/css/home.css
		- Server.js
		- package.json
		

How to compile JAVA files? 

Change to folder Library 
	cd Library

Compile:  javac *.java

How to run JAVA files? 

Example:
BookLoans is the entry class. 
CreateBorrowerTable is the entry class.

Run each entry class individually.

Example:
java BookLoans.java 

Where to See output: 

Output can be checked in MYSQL Terminal.
Basic commands in MYSQL to check the output. 
For IOS: mysql -u root -p 
// use library;
// select * from table_name; 
// describe table_name;
// show tables;
// select count(*) from table_name;


How to run Node.js files?

	Do a quick spotlight search on terminal
	Change to the directory where the Node folder is located
	do npm install -express,-mysql, -body-parser
	and then use this command node server.js

Output on terminal: 
	Listening on port 8081:

Output on Browser window:
	localhost:8081/
	// You will be directed to the home page where the advanced search tabs is located





