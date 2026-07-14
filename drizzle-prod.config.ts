export default {
  out: './migrations',
  schema: './schema/*',
  dialect: 'postgresql',

  schemaFilter: ['public', 'app'],

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
};

