import { GraphQLString } from "graphql";
import { USER_ACCESS_TOKEN } from "../../const";
import { User } from "../../Entities/User";
import { MessageType } from "../typeDef/Message";
import bcrypt from 'bcrypt';
import { UserType } from "../../Entities/UserType";
import { sign } from "jsonwebtoken"
// import atob from "atob"
// var fs = require('fs');

export const RegisterUser = {
    type: MessageType,
    args: {
        user_name: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        type: { type: GraphQLString },
        avatar: { type: GraphQLString }
    },
    async resolve(parent: any, args: any) {
        const type = args['type']
        const _type = await UserType.findOne({
            where: {
                type: type
            }
        })
        const type_id = _type?.id
        console.log(type_id);

        const salt = bcrypt.genSaltSync(10)
        const hash_pass = await bcrypt.hash(args['password'], salt)
        const user = User.create({
            user_name: args['user_name'],
            email: args['email'],
            password: hash_pass,
            type_id: type_id
        })
        await User.insert(user)

        var password = user!.password as string;

        const valid = bcrypt.compareSync(args['password'], password);

        if (valid) {
            const _token = sign({ id: user!.id }, USER_ACCESS_TOKEN)
            return { code: 200, msg: "User Created Successfully", data: _token }
        }
    }

}
/* 
function convertDataUrlToBlob(dataUrl: any, email: string) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1] as string;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const filename = email + "." + mime.split("/")[1];
    console.log(filename);

    fs.writeFile(filename, u8arr, (error: any) => { if (error) throw error });
    // return new Blob([u8arr], , {type:mime});
} */