CREATE TABLE "apple_tokens" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"refresh_token" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"user_id" uuid NOT NULL,
	"id" uuid NOT NULL,
	"seq" bigserial NOT NULL,
	"drill_id" text NOT NULL,
	"result" text NOT NULL,
	"at" bigint NOT NULL,
	"session_id" uuid,
	CONSTRAINT "attempts_user_id_id_pk" PRIMARY KEY("user_id","id")
);
--> statement-breakpoint
CREATE TABLE "clip_sessions" (
	"user_id" uuid NOT NULL,
	"id" uuid NOT NULL,
	"seq" bigserial NOT NULL,
	"at" bigint NOT NULL,
	"hand" text NOT NULL,
	"discipline" text NOT NULL,
	"frames" integer NOT NULL,
	"arm_ratio" real NOT NULL,
	"baseline" boolean DEFAULT false NOT NULL,
	CONSTRAINT "clip_sessions_user_id_id_pk" PRIMARY KEY("user_id","id")
);
--> statement-breakpoint
CREATE TABLE "clip_strokes" (
	"user_id" uuid NOT NULL,
	"id" uuid NOT NULL,
	"seq" bigserial NOT NULL,
	"session_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"start_t" real NOT NULL,
	"end_t" real NOT NULL,
	"pause" real,
	"confidence" real NOT NULL,
	"phase_source" text NOT NULL,
	"address_wrist_l" real,
	"back_wrist_l" real,
	"follow_wrist_l" real,
	"elbow_range_l" real,
	"back_cue" real,
	"follow_cue" real,
	"cue_conf" real,
	CONSTRAINT "clip_strokes_user_id_id_pk" PRIMARY KEY("user_id","id")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "shot_results" (
	"user_id" uuid NOT NULL,
	"id" uuid NOT NULL,
	"seq" bigserial NOT NULL,
	"run_id" uuid NOT NULL,
	"drill_id" text NOT NULL,
	"shot" integer NOT NULL,
	"pot" boolean NOT NULL,
	"position" boolean,
	"at" bigint NOT NULL,
	CONSTRAINT "shot_results_user_id_id_pk" PRIMARY KEY("user_id","id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"apple_sub" text NOT NULL,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_apple_sub_unique" UNIQUE("apple_sub")
);
--> statement-breakpoint
ALTER TABLE "apple_tokens" ADD CONSTRAINT "apple_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clip_sessions" ADD CONSTRAINT "clip_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clip_strokes" ADD CONSTRAINT "clip_strokes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shot_results" ADD CONSTRAINT "shot_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempts_user_seq_idx" ON "attempts" USING btree ("user_id","seq");--> statement-breakpoint
CREATE INDEX "clip_sessions_user_seq_idx" ON "clip_sessions" USING btree ("user_id","seq");--> statement-breakpoint
CREATE INDEX "clip_strokes_user_seq_idx" ON "clip_strokes" USING btree ("user_id","seq");--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shot_results_user_seq_idx" ON "shot_results" USING btree ("user_id","seq");