import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPass = async (pass) => {
  const passHashed = await bcrypt.hash(pass, saltRounds);
  return passHashed;
};

export const compareHashPass = async (pass, hash) => {
  const isPass = await bcrypt.compare(pass, hash);
  return isPass;
};