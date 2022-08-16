import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// referencia de atributos de cada una de las tablas de base de datos 
@Schema()
export class Pokemon extends Document {
    // id:string // mongo lo da pór defecto este parametro de tipo uuid
    // prop se refiere a propiedades
    // index ayuda a realizar una busqueda mas rapida e eficiente, es por ejemplo el indice de los libros
    @Prop({
        unique: true,
        index: true
    })
    name: string;

    @Prop({
        unique: true,
        index: true
    })
    no: number;
}

export const PokemonShema = SchemaFactory.createForClass(Pokemon);
