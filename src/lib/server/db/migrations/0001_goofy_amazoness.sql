CREATE TYPE "public"."connectionProtocol" AS ENUM('DccEx', 'Lcc');--> statement-breakpoint
CREATE TYPE "public"."connectionType" AS ENUM('Serial', 'Emulator');--> statement-breakpoint
CREATE TYPE "public"."trainDirection" AS ENUM('Forward', 'Reverse', 'Unknown');--> statement-breakpoint
CREATE TYPE "public"."trainFunctionIcon" AS ENUM('Speaker', 'Light1', 'Light2', 'Bell', 'Text');--> statement-breakpoint
CREATE TYPE "public"."trainFunctionMode" AS ENUM('Toggle', 'Select');--> statement-breakpoint
CREATE TABLE "app"."settings" (

);
--> statement-breakpoint
CREATE TABLE "app"."connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"layoutId" uuid NOT NULL,
	"protocol" "connectionProtocol" DEFAULT 'DccEx' NOT NULL,
	"type" "connectionType" DEFAULT 'Emulator' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."layouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."function" (
	"value" varchar NOT NULL,
	"trainId" uuid NOT NULL,
	"name" varchar(255) DEFAULT 'New Function' NOT NULL,
	"icon" "trainFunctionIcon" DEFAULT 'Text' NOT NULL,
	"mode" "trainFunctionMode" DEFAULT 'Toggle' NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"state" boolean DEFAULT false NOT NULL,
	CONSTRAINT "function_value_trainId_pk" PRIMARY KEY("value","trainId")
);
--> statement-breakpoint
CREATE TABLE "app"."trains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"layoutId" uuid NOT NULL,
	"address" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"comment" varchar(255) NOT NULL,
	"connectionId" uuid,
	"direction" "trainDirection" DEFAULT 'Unknown' NOT NULL,
	"speed" integer DEFAULT 0 NOT NULL,
	"userControllingId" uuid
);
--> statement-breakpoint
CREATE TABLE "app"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar
);
--> statement-breakpoint
DROP TABLE "people" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
DROP TABLE "app"."layout" CASCADE;--> statement-breakpoint
ALTER TABLE "app"."connections" ADD CONSTRAINT "connections_layoutId_layouts_id_fk" FOREIGN KEY ("layoutId") REFERENCES "app"."layouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."function" ADD CONSTRAINT "function_trainId_trains_id_fk" FOREIGN KEY ("trainId") REFERENCES "app"."trains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."trains" ADD CONSTRAINT "trains_layoutId_layouts_id_fk" FOREIGN KEY ("layoutId") REFERENCES "app"."layouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."trains" ADD CONSTRAINT "trains_connectionId_connections_id_fk" FOREIGN KEY ("connectionId") REFERENCES "app"."connections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."trains" ADD CONSTRAINT "trains_userControllingId_users_id_fk" FOREIGN KEY ("userControllingId") REFERENCES "app"."users"("id") ON DELETE set null ON UPDATE no action;