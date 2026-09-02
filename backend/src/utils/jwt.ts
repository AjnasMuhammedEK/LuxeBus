import jwt ,  { JwtPayload }  from "jsonwebtoken";


interface DecodedUser extends JwtPayload {
  id: string;
  role: string;
}


export const generateAccessToken = (id : string , role : string) : string => {
  return jwt.sign (
    {id , role},
    process.env.JWT_SECRET!,
    {expiresIn : '20s'}
  )
}


export const generateRefreshToken = (id : string , role : string) : string  => {
  return jwt.sign(
    {id , role},
    process.env.REFRESH_JWT_SECRET!,
    {expiresIn : '1m'}
  )
}

export const verifyAccessToken = (token : string) : DecodedUser | null => {

  try {
    
    const decoded = jwt.verify(token , process.env.JWT_SECRET as string) as DecodedUser

    return decoded
  } catch (error) {
    return null
  }
   
}

export const  verifyRefreshToken = (token : string) : DecodedUser | null => {
  try {
    
    const decoded = jwt.verify(token , process.env.REFRESH_JWT_SECRET as string) as DecodedUser

    return decoded
  } catch (error) {
    return null
  }
}