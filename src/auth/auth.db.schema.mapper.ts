import { IUserDbSchema } from "./auth.db.dao";
import { IUserWithPassword } from "./auth.service";

export class AuthDbSchemaMapper {

    public static mapUserSchemaToUser(userDbSchema: IUserDbSchema): IUserWithPassword {
        return {
            userId: userDbSchema.userId,
            username: userDbSchema.username,
            password: userDbSchema.password
        }
    }

}