import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// estos dos paguetes sirven para paginas estaticas
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';


@Module({
  imports: [
    // sirve para poder enviar objetos estáicos o páginas estaticas.
    ServeStaticModule.forRoot({
      //rootPath:join(__dirname,'../public') segunda forma
      rootPath:join(__dirname,'..','public')
    }),
    // referencia a la base de datos
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    PokemonModule,
    CommonModule
  ],
})
export class AppModule {}
