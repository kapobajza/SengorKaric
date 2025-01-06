CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
