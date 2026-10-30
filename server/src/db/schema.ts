import { bigint, bigserial, boolean, index, integer, pgTable, primaryKey, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/** Một người là một Apple ID: `apple_sub` là `sub` trong identityToken, không đổi qua các lần cài lại. */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  appleSub: text('apple_sub').notNull().unique(),
  email: text('email'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

/** Refresh token Apple trả lúc đổi authorization code, chỉ dùng để gọi revoke khi xoá account. */
export const appleTokens = pgTable('apple_tokens', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id),
  refreshToken: text('refresh_token').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Refresh token của API: chỉ lưu hash, token gốc nằm ở SecureStore trên máy. */
export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('refresh_tokens_user_idx').on(t.userId)],
);

/**
 * Bốn bảng sync dưới đây chép cột từ SQLite trên máy (`src/pool-engine/*-log.ts`). `id` do client sinh (uuid7),
 * khoá chính ghép với `user_id` để người này không chiếm được id của người khác. `seq` là cursor của `GET /sync`.
 * `at` là epoch ms như phía client.
 */
const syncColumns = {
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  id: uuid('id').notNull(),
  seq: bigserial('seq', { mode: 'number' }).notNull(),
};

export const attempts = pgTable(
  'attempts',
  {
    ...syncColumns,
    drillId: text('drill_id').notNull(),
    result: text('result').notNull(),
    at: bigint('at', { mode: 'number' }).notNull(),
    sessionId: uuid('session_id'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.id] }), index('attempts_user_seq_idx').on(t.userId, t.seq)],
);

export const shotResults = pgTable(
  'shot_results',
  {
    ...syncColumns,
    runId: uuid('run_id').notNull(),
    drillId: text('drill_id').notNull(),
    shot: integer('shot').notNull(),
    pot: boolean('pot').notNull(),
    position: boolean('position'),
    at: bigint('at', { mode: 'number' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.id] }), index('shot_results_user_seq_idx').on(t.userId, t.seq)],
);

/** Không có `clip_uri`: video nằm trên máy, server chỉ giữ số đo. */
export const clipSessions = pgTable(
  'clip_sessions',
  {
    ...syncColumns,
    at: bigint('at', { mode: 'number' }).notNull(),
    hand: text('hand').notNull(),
    discipline: text('discipline').notNull(),
    frames: integer('frames').notNull(),
    armRatio: real('arm_ratio').notNull(),
    baseline: boolean('baseline').notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.userId, t.id] }), index('clip_sessions_user_seq_idx').on(t.userId, t.seq)],
);

export const clipStrokes = pgTable(
  'clip_strokes',
  {
    ...syncColumns,
    sessionId: uuid('session_id').notNull(),
    idx: integer('idx').notNull(),
    startT: real('start_t').notNull(),
    endT: real('end_t').notNull(),
    pause: real('pause'),
    confidence: real('confidence').notNull(),
    phaseSource: text('phase_source').notNull(),
    addressWristL: real('address_wrist_l'),
    backWristL: real('back_wrist_l'),
    followWristL: real('follow_wrist_l'),
    elbowRangeL: real('elbow_range_l'),
    backCue: real('back_cue'),
    followCue: real('follow_cue'),
    cueConf: real('cue_conf'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.id] }), index('clip_strokes_user_seq_idx').on(t.userId, t.seq)],
);
