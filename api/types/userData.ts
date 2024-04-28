import { EnumType } from "typescript"

export type userData  = {
    username : string,
    email : string,
    password : string,
    permissionLevel : "Comum" | "Administrador" | "Restaurante"
}