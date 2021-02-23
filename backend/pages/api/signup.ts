import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

import { connectDatabase } from '../../utils/database';
import { hashPass } from '../../utils/passwordHash';
import authConfig from '../../utils/auth';

interface User {
  id: string
  name: string,
  email: string,
}

interface ResponseType {
  status: string
  message: string
  payload: string | { user: User, token: string }
}

export default async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  if(req.method === 'POST'){
    const { name, email, password } = req.body;

    if(!name || !email || !password ) {
      return res.status(400).json({
        status: 'error', 
        message: 'Incorrect body object',
        payload: '' 
      })
    }

    const { db } = await connectDatabase();

    let user = await db.collection('users').findOne({ email })

    if (!user){
      const userData = {
        ...req.body,
        password: await hashPass(password)
      }
      
      user = await db.collection('users').insertOne(userData);

      const userResponse = {
        id: user.ops[0]._id,
        name: user.ops[0].name,
        email: user.ops[0].email
      }

      return res.status(200).json({
        status: 'success',
        message: 'User has been created',
        payload: {
          user: userResponse,
          token: jwt.sign(userResponse, authConfig.jwt_secret, { expiresIn: authConfig.expiresTime })
        },
      });
    }
    
    return res.status(400).json({
      status: 'Error',
      message: 'This email is already registered',
      payload: ''
    })
      
  } else return res.status(400).json({
      status: 'error',
      message: 'Wrong request method',
      payload: ''
    });
 
};
