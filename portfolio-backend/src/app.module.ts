import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkModule } from './artwork/artwork.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.PORTFOLIO_DB_USER ,
      password: process.env.PORTFOLIO_DB_PASSWORD ,
      database: process.env.PORTFOLIO_DB_NAME ,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ArtworkModule,
    AuthModule,
  ],
})
export class AppModule {}
