import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //10 digitos

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password) //user.pasword{[pasword: ""]}

