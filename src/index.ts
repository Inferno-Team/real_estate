import express from "express"
import { graphqlHTTP } from "express-graphql"
import cors from "cors"
import { mysqlConnection } from "./mysql_config"
import { schema } from "./Schema"
import { verify } from "jsonwebtoken"
import { USER_ACCESS_TOKEN } from "./const"
import bodyParser from 'body-parser'
import path from "path"
import fileUpload, { UploadedFile } from 'express-fileupload'
const main = async () => {

    await mysqlConnection();
    //  restFul api

    const app = express()
    app.use((req, _, next) => {
        const token = req.header('authorization')?.split(' ')[1]
        const bearer = req.header('authorization')?.split(' ')[0]

        if (token === undefined || token === null || bearer != 'Bearer') {
            next()
            return;
        }
        const user = verify(token!, USER_ACCESS_TOKEN) as any
        (req as any).userId = user.id
        next()
    })

    app.use(fileUpload({
        createParentPath: true
    }));

    app.use(cors())
    app.use(express.json())
    app.use('/graphql',

        graphqlHTTP({
            schema: schema,
            graphiql: true
        }))
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );

    app.post('/upload_avatar', async (req, res) => {
        try {
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let avatar = req.files.avatar as UploadedFile;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                
                avatar.mv(__dirname+'../../imgs/' + avatar.name);

                //send response
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: avatar.name,
                        mimetype: avatar.mimetype,
                        size: avatar.size
                    }
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.listen(3001, () => {
        console.log("Server is running.")
    })
}

main().catch(err =>
    console.log(err)
);

