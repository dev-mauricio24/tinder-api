import { Op } from "sequelize";
import { User, Skill } from "../database/db.js";
import { paginator } from "../helpers/pagination.js";

export const getUsers = async(req, res) => {
  const { skill } = req.query;
  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 10;

  const  offset = (page - 1) * size;
  const limit = size;

  try {
    const { count, rows} = await User.findAndCountAll({
      limit,
      offset,
      where: {
        status: {
          [Op.eq]: 'activo'
        }
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      },
      include: [{
        model: Skill,
        attributes: ['name'],
        through: { attributes: [] },
        where: {
          name: {
            [Op.like]: `%${skill.toLowerCase()}%`
          }
        }
      }],
    });
    const pagination = paginator(count, page, size); // Paginación
    return res.status(200).json({
      ok: true,
      users: rows,
      pagination
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

export const getProfile = async (req, res) => {
  const id = req.user;
  try {
    const user = await User.findOne({
      where: { 
        id,
        status: 'activo' 
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      },
      include: [
        {
          model: Skill,
          attributes: ['name'],
          through: { attributes: [] }
        },
      ]
    });

    if(!user) return res.status(404).json({
      message: 'usuario no encontrado'
    })
    return res.status(200).json({
      ok: true,
      user
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

export const getUserById = async(req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { 
        id,
        status: 'activo' 
      },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Skill,
        attributes: ['name'],
        through: { attributes: [] }
      }]
    });
    if(!user)return res.status(404).json({
      message: 'usuario no encontrado'
    })
    return res.status(200).json({
      ok: true,
      user
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

export const updateUser = async(req, res) => {
  const id = req.user;
  try {
    const user = await User.findOne({where: { id }});
    if(!user) return res.status(404).json({
      message: 'Usuario no encontrado.'
    });
    user.set(req.body);
    await user.save();
    return res.status(200).json({
      ok: true,
      message: `El perfil ha sido actualizado.`,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

export const addSkills = async (req, res) => {
  const id  = req.user;
  const { name } = req.body;
 
  try {
    const user = await User.findOne( {where: { id } } );
    const [skill, created] = await Skill.findOrCreate( { where: { name }, defaults: { name } } );

    if(!user) return res.status(404).json({
      message: 'Usuario no encontrado.'
    })
    await skill.addUser(user);
    return res.status(201).json({
      ok: true,
      message: 'Se ha agregado una habilidad a tu perfil.',
      skill: { name: skill.name }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    });
  }
}

export const deleteUser = async(req, res) => {
  const id  = req.user;
  try {
    const user = await User.findOne({
      where: { id }
    });
    if(!user)
      return res.status(404).json({
        message: 'Usuario no encontrado.'
      });
    user.status = 'inactivo';
    await user.save();
    return res.status(200).json({
      ok: true,
      message: 'El perfíl ha sido eliminado.'
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
