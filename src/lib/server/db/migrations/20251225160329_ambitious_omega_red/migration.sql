CREATE TYPE "public"."sensorState" AS ENUM('Active', 'Inactive', 'Unknown');--> statement-breakpoint
ALTER TYPE "public"."connectionType" ADD VALUE 'Wifi';--> statement-breakpoint
ALTER TYPE "public"."connectionType" ADD VALUE 'Undefined';--> statement-breakpoint
CREATE TABLE "app"."sensors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"layoutId" uuid NOT NULL,
	"connectionId" uuid,
	"name" varchar(255) NOT NULL,
	"comment" varchar(255) NOT NULL,
	"state" "sensorState" NOT NULL,
	"inverted" boolean DEFAULT false NOT NULL,
	"activationDelay" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."connections" ADD COLUMN "isConnected" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."connections" ADD COLUMN "hardware" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."sensors" ADD CONSTRAINT "sensors_layoutId_layouts_id_fk" FOREIGN KEY ("layoutId") REFERENCES "app"."layouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."sensors" ADD CONSTRAINT "sensors_connectionId_connections_id_fk" FOREIGN KEY ("connectionId") REFERENCES "app"."connections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."connections" DROP COLUMN "type";