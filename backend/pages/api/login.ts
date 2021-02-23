import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

import { connectDatabase } from '../../utils/database';
import { compareHashPass } from '../../utils/passwordHash';
import authConfig from '../../utils/auth';


interface User {
  id: string
  name: string,
  email: string,
}

interface ResponseType {
  status: string
  message: string
  payload: string | {user: User, token: string}
}

export default async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  if(req.method === 'POST'){
    const { email, password } = req.body;

    if(!email || !password ) {
        return res.status(400).json({
            status: 'error', 
            message: 'Incorrect body object',
            payload: '' 
        })
    }

    const { db } = await connectDatabase();

    let user = await db.collection('users').findOne({ email })

    if(!user) {
        return res.status(401).json({
            status: 'Error',
            message: 'User does not exist',
            payload: ''
        })
    }

    if(!(await compareHashPass(password, user.password))){
        return res.status(401).json({
            status: 'Error',
            message: 'Invalid password',
            payload: ''
        })
    }

    const { _id, name } = user;
    
    return res.status(200).json({
        status: 'success',
        message: 'user has been logged',
        payload: {
            user: {
                id: _id,
                name: name,
                email: email,
            },
            token: jwt.sign({ _id, name, email }, authConfig.jwt_secret, { expiresIn: authConfig.expiresTime })
        },
    });
    
  } else return res.status(400).json({
        status: 'error',
        message: 'Wrong request method',
        payload: ''
    });
 
};
