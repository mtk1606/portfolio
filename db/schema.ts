import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const arcadeRuns=sqliteTable('arcade_runs',{id:text('id').primaryKey(),game:text('game').notNull(),started:integer('started').notNull(),used:integer('used').notNull().default(0)});
export const arcadeScores=sqliteTable('arcade_scores',{id:text('id').primaryKey(),game:text('game').notNull(),name:text('name').notNull(),score:integer('score').notNull(),created:integer('created').notNull()});
