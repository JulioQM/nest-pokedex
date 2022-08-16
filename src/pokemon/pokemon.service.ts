import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  /*   @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon> */

  // creación de constructor
  constructor(
    // uso de inyecion de depencia basodo en nest
    // injeccion de modelos
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>) { }


  async create(createPokemonDto: CreatePokemonDto) {
    //return 'This action adds a new pokemon';
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    /* return createPokemonDto; */
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
      }
      console.log(error);
      throw new InternalServerErrorException(`Can´t create pokemon -Check serber logs`);

    }
  }

  async findAll() {
    //return `This action returns all pokemon`;
    const pokemon = await this.pokemonModel.find();
    return pokemon;
  }

  async findOne(id: string) {
    let pokemon: Pokemon; // referenciando a la entidad de pokemon
    // isNaN quiere decir(no es número)
    // busqueda por no:number
    //console.log(isString(id))
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }

    // Mongo ID
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }
    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: id.toLocaleLowerCase().trim() });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${id}" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {
    // primera forma
    /* const pokemon=await this.findOne(id);
   await pokemon.deleteOne(); */

    //  segunda forma
    /* const result=await this.pokemonModel.findByIdAndDelete(id)
    console.log(result)
    if(result===null) throw new BadRequestException(`No existe ${id} in bd` );  
     return result; */
     // tercer forma, regla que no es necesario encerrar en try catch

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return;

  }
  // metodo generico de excepciones, exepciones no controlada
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can´t create pokemon -Check serber logs`);

  }
}
