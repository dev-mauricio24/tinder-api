import { Company, Service } from "../database/db.js";

export const getCompany = async (req, res) => {
  const id = req.user;
  try {
    const company = await Company.findOne({
      where: { 
        id,
        status: 'activo' 
      },
      attributes: {
        exclude: ['password', 'status', 'createdAt']
      }
    });
    if(!company) return res.status(404).json({
      message: 'usuario no encontrado'
    })
    return res.status(200).json({
      ok: true,
      company
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

export const updateCompany = async(req, res) => {
  const id = req.user;
  try {
    const company = await Company.findOne({where: { id }});
    if(!company) return res.status(404).json({
      message: 'Usuario no encontrado.'
    });
    company.set(req.body);
    await company.save();
    
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

export const deleteCompany = async(req, res) => {
  const id  = req.user;
  try {
    const company = await Company.findOne({
      where: { 
        id,
        status: 'activo'  
      }
    });
    if(!company)
      return res.status(404).json({
        message: 'Usuario no encontrado.'
      });
    company.status = 'inactivo';
    await company.save();
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