import { GraphQLFloat, GraphQLInt, GraphQLString } from "graphql";
import { RealState } from "../../Entities/RealEstate";
import { MessageType } from "../typeDef/Message";


export const AddRealEstate = {
    type: MessageType,
    args: {
        log: {
            type: GraphQLFloat
        },
        lat: {
            type: GraphQLFloat
        },
        type: {
            type: GraphQLString
        },
        location: {
            type: GraphQLString
        },
        rate: {
            type: GraphQLInt
        },
        buy_type: {
            type: GraphQLString
        },
        budget: {
            type: GraphQLFloat
        },
        // img_url: {
        //     type: GraphQLString
        // }
    },
    async resolve(parent: any, args: any, context: any) {
        const userId = context.userId;
        const real = RealState.create({
            user_id: userId,
            lat: args.lat,
            log: args.log,
            budget: args.budget,
            buy_type: args.buy_type,
            img_url: '/imgs/img1.jpg',
            type: args.type,
            location: args.location,
            rate: args.rate
        });
        await RealState.insert(real);
        return {
            code: 200,
            msg: "real estate created successfully",
            data: null
        }
    }
}