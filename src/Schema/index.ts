import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { AddRealEstate } from "./Mutations/RealState";
import { RegisterUser } from "./Mutations/User";
import { GET_REAL_ESTATES_INSIDE_CIRCLE, GET_REAL_STATES, GET_REAL_STATE_DETAILS, GET_USER_REAL_STATES } from "./Queries/RealState";
import { GET_USER, GET_USER_LOVED_STATES, GET_USER_RATE, LOG_IN } from "./Queries/User";

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: () => ({
        login: LOG_IN,
        getUserRate:GET_USER_RATE,
        getUser:GET_USER,
        getUserRealStates:GET_USER_REAL_STATES,
        getUserLovedStates:GET_USER_LOVED_STATES,
        getAllRealStates:GET_REAL_STATES,
        getRealEstateDetails:GET_REAL_STATE_DETAILS,
        getRealEstatesInsideCircle:GET_REAL_ESTATES_INSIDE_CIRCLE
    })
})
const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: () => ({
        register:RegisterUser,
        add_real_estate:AddRealEstate
    })
})



export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})