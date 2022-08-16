import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonShema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  // en este apartado agrego las clases-entity a emplear
  imports: [MongooseModule.forFeature([
    {
    name: Pokemon.name,
    schema: PokemonShema
  }
])]
})
export class PokemonModule { }
