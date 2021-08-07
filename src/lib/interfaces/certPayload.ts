import { INam } from "./subcomponent/nam";
import { IVaccine } from "./subcomponent/vInterface";

export interface ICertPayLoad{
    v: Array<IVaccine>,
    nam :{
        [key:string]:INam
    }
    ver:String, 
    dob:String,
}

