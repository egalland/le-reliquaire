import { sqliteTable, text, integer, primaryKey, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
// Durable game data; schema-only migrations generated with Drizzle.
export const rCampaigns = sqliteTable('r_campaigns', {
 id:text('id').primaryKey(), owner:text('owner_id').notNull(), data:text('data').notNull(), updated:integer('updated_at').notNull(),
}, table => [index('rCampaigns_lookup').on(table.owner)]);
export const rSessions = sqliteTable('r_sessions', {
 id:text('id').primaryKey(), owner:text('owner_id').notNull(), code:text('code').notNull().unique(), name:text('name').notNull(), mode:text('mode').notNull(), status:text('status').notNull(), duration:integer('duration').notNull(), campaign:text('campaign').notNull(), started:integer('started_at'), deadline:integer('deadline'), paused:integer('paused_at'), pausedMs:integer('paused_ms').notNull().default(0), created:integer('created_at').notNull(),
}, table => [index('rSessions_lookup').on(table.owner, table.created)]);
export const rTeams = sqliteTable('r_teams', {
 id:text('id').primaryKey(), session:text('session_id').notNull(), name:text('name').notNull(), members:text('members').notNull(), token:text('token_hash').notNull(), recovery:text('recovery_hash').notNull(), state:text('state').notNull(), version:integer('version').notNull().default(0), lat:text('lat'), lng:text('lng'), accuracy:text('accuracy'), located:integer('located_at'), distance:integer('distance').notNull().default(0), steps:integer('steps').notNull().default(0), stepsSupported:integer('steps_supported').notNull().default(0), created:integer('created_at').notNull(),
}, table => [index('rTeams_lookup').on(table.session)]);
export const rMessages = sqliteTable('r_messages', {
 id:text('id').primaryKey(), session:text('session_id').notNull(), team:text('team_id'), channel:text('channel').notNull(), author:text('author').notNull(), body:text('body').notNull(), created:integer('created_at').notNull(),
}, table => [index('rMessages_lookup').on(table.session, table.created)]);
export const rEvents = sqliteTable('r_events', {
 id:text('id').primaryKey(), session:text('session_id').notNull(), team:text('team_id'), kind:text('kind').notNull(), detail:text('detail').notNull(), created:integer('created_at').notNull(),
}, table => [index('rEvents_lookup').on(table.session, table.created)]);
export const rLocations = sqliteTable('r_locations', {
 id:text('id').primaryKey(), session:text('session_id').notNull(), team:text('team_id').notNull(), lat:text('lat').notNull(), lng:text('lng').notNull(), accuracy:text('accuracy').notNull(), created:integer('created_at').notNull(),
}, table => [index('rLocations_lookup').on(table.session, table.created)]);
export const rPhotos = sqliteTable('r_photos', {
 id:text('id').primaryKey(), session:text('session_id').notNull(), team:text('team_id').notNull(), mission:text('mission_id').notNull(), key:text('object_key').notNull(), caption:text('caption').notNull(), points:integer('points').notNull().default(0), reviewed:integer('reviewed').notNull().default(0), created:integer('created_at').notNull(),
}, table => [uniqueIndex('r_photos_team_mission').on(table.team, table.mission), index('r_photos_session').on(table.session)]);
