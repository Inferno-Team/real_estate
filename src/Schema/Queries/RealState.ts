import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { resolve } from "path/posix";
import { RealState } from "../../Entities/RealEstate";
import { RealStateType } from "../typeDef/RealState";


export const GET_USER_REAL_STATES = {
    type: GraphQLList(RealStateType),
    async resolve(parent: any, args: any, context: any) {
        const userId = context.userId;
        if (userId === undefined)
            return []
        return RealState.find({ where: { user_id: userId }, relations: ['user'] })
    }
}

export const GET_REAL_STATES = {
    type: GraphQLList(RealStateType),
    async resolve() {
        return await RealState.find();
    }
}
export const GET_REAL_STATE_DETAILS = {
    type: RealStateType,
    args: {
        id: { type: GraphQLString }
    },
    async resolve(parent: any, args: any) {
        return await RealState.findOne({
            where: {
                id: args?.id
            },
            relations: ['user', 'rooms', 'video']
        })
    }
}
export const GET_REAL_ESTATES_INSIDE_CIRCLE = {
    type: GraphQLList(RealStateType),
    args: {
        lat: { type: GraphQLString },
        long: { type: GraphQLString },
        zoom: { type: GraphQLString }
    },
    async resolve(parent: any, args: any) {
        const allReal = await RealState.find();
        var mpp = 0; // meter per pixle
        // if (parseFloat(args.zoom) == 14.0)
        //     mpp = 3.660;
        switch (parseFloat(args.zoom)) {
            case 13.0:
                mpp = 7.319;
                break;
            case 14.0:
                mpp = 3.660;
                break;
            case 15.0:
                mpp = 1.830;
                break;

            default:
                mpp = 3.660;
                break;
        }
        const radius = mpp / 500; // 500 m
        const x_center = parseFloat(args?.lat);
        const y_center = parseFloat(args?.long);
        // console.log("radius : " + radius);

        const real = [];
        let real_index = 0;
        for (let index = 0; index < allReal.length; index++) {
            const element = allReal[index];
            const x = element.lat;
            const y = element.log;
            const _x = Math.pow((x - x_center), 2);
            const _y = Math.pow((y - y_center), 2);
            const rad = _x + _y;

            if (rad <= Math.pow(radius, 2)) {
                real[real_index++] = element;
            }
        }
        console.log(real);
        return real;
    }
}