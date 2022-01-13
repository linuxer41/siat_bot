import pg from 'pg'
export const client = new pg.Client({
    user: 'linuxer',
    host: 'api.snatchd.co',
    database: 'snatchd',
    password: 'anarkia41',
    port: 5434,
  })

// export const migrate_client = new pg.Client({
//     user: 'linuxer',
//     host: 'localhost',
//     database: 'snatchd',
//     password: 'anarkia41',
//     port: 5432,
//   });
export const migrate_client = new pg.Client({
    user: 'linuxer',
    host: 'api.snatchd.co',
    database: 'snatchd',
    password: 'anarkia41',
    port: 5434,
  })
