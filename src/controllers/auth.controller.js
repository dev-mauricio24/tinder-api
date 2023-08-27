
import { Op } from "sequelize";
import { User, Company } from "../database/db.js";
import { encryptPass, validatePass } from "../helpers/encrypt.js";

export const SignUp = async (req, res) => {
  let model;
  const { password, email, type, ...rest } = req.body;
  type === "company" ? (model = Company) : (model = User);

  try {
    const hash = encryptPass(password);
    const [account, created] = await model.findOrCreate({
      where: { email },
      defaults: {
        ...rest,
        email,
        password: hash,
      }
    })
    if(!created) return res.status(404).json({
      message: "Ya existe una cuenta con este email."
    });
    return res.status(201).json({
      ok: true,
      message: "El usuario ha sido creado!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  let model;
  const { email, type } = req.body;
  const hash = req.body.password;
  type === "company" ? (model = Company) : (model = User);
  try {
    const account = await model.findOne({
      where: {
        email,
        status: {
          [Op.eq]: 'activo'
        },
      },
    });
    if (!account) return res.status(400).json({
      message: "Credenciales Incorrectas."
    });
    const validPassword = validatePass(hash, account.password)
    if (!validPassword) return res.status(400).json({ 
      message: "Credenciales Incorrectas." 
    });
    return res.status(200).json({
      ok: true,
      uuid: account.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "El usuario no existe." });

    const hash = encryptPass(password);
    user.password = hash;
    await user.save();
    
    return res.status(200).json({
      ok: true,
      message: "La contraseña ha sido actualizada.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
