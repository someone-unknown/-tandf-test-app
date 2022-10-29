require('dotenv').config();
import 'reflect-metadata';

import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { json } from 'body-parser';
import cors, { CorsRequest } from 'cors';
import express, { Express } from 'express';
import Container from 'typedi';
import { createConnection, useContainer, Connection } from 'typeorm';

import buildSchema from './configure/schema';
// eslint-disable-next-line import/no-named-as-default
import getTypeOrmConfig from './configure/typeorm.config';
import { MyContext } from './types/types';

async function main(): Promise<void> {
  useContainer(Container);

  const connectionOptions = await getTypeOrmConfig();
  const connection: Connection = await createConnection(connectionOptions);
  await connection.runMigrations();

  const app: Express = express();
  const httpServer: http.Server = http.createServer(app);

  const apolloServer: ApolloServer<MyContext> = new ApolloServer<MyContext>({
    schema: await buildSchema(),
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors<CorsRequest>({
      origin: '*',
      methods: '*',
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res }),
    }),
  );

  await new Promise<void>((resolve, reject): void => {
    httpServer.on('listening', resolve);
    httpServer.on('error', reject);
    httpServer.listen(8080, '0.0.0.0');
  });
}

main()
  .then((): void => {
    // eslint-disable-next-line no-console
    console.log('server started on localhost:8080');
  })
  .catch((error: Error): void => {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(-1);
  });