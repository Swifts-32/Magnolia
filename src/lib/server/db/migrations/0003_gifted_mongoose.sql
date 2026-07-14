DROP TYPE "public"."connectionType";--> statement-breakpoint
CREATE TYPE "public"."connectionType" AS ENUM('Serial', 'Emulator', 'Undefined');