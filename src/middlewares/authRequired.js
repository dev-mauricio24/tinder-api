import { Company, User } from "../database/db.js";

export const authRequired = async(req, res, next) => {
  const { uuid } = req.headers

  if(!uuid) return res.status(403).json({
    message: 'Acceso Denegado!'
  })
  req.user = uuid;
  try {
    const user = await User.findByPk(uuid);
    if(!user) return res.status(401).json({
      message: 'No tiene permiso para ejecutar la acción!'
    })
    next()
  } catch (error) {
    console.log(error)
  }
}

export const CompanyRequired = async(req, res, next) => {
  const { uuid } = req.headers

  if(!uuid) return res.status(403).json({
    message: 'Acceso Denegado!'
  })
  req.user = uuid;
  try {
    const company = await Company.findByPk(uuid);
    if(!company) return res.status(401).json({
      message: 'No tiene permiso para ejecutar la acción!'
    })
    next()
  } catch (error) {
    console.log(error)
  }
}

export const authenticated = async(req, res, next) => {
  const { uuid } = req.headers

  if(!uuid) return res.status(401).json({
    message: 'Acceso Denegado!'
  })
  req.user = uuid;
  next();
}
