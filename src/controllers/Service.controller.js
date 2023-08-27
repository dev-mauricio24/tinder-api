import { Op } from "sequelize";
import { mailAcceptHTML, mailDeclineHTML, mailHTML, transporter } from "../helpers/mailer.js";
import { Company, Service, User } from "../database/db.js";

export const getServicesByCompany = async(req, res) => {
  const id  = req.user;
  try {
    const services = await Service.findAll({
      where: {
        company_id: {
          [Op.eq]: id
        }
      },
      include: {
        model: User
      }
    })
    return res.status(200).json({
      ok: true,
      services
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export const getUnssignedServices = async(req, res) => {
  const id  = req.user;
  try {
    const services = await Service.findAll({
      where: {
        company_id: {
          [Op.eq]: id
        },
        status: {
          [Op.eq]: 'sin asignar'
        }
      },
      attributes: ['id', 'name']
    })
    return res.status(200).json({
      ok: true,
      services
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export const getServiceById = async (req, res) => {
  const service_id = Number(req.params.service_id);

  try {
    const service = await Service.findOne({
      where: { id: service_id },
      include: {
        model: Company
      }
    })

    if(!service) return res.status(404).json({
      message: 'Servicio no encontrado'
    })
    res.status(200).json({
      ok: true,
      service
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export const getServicesByUser = async(req, res) => {
  const id  = req.user;
  try {
    const services = await Service.findAll({
      where: {
        user_id: {
          [Op.eq]: id
        }
      },
      include: {
        model: Company
      }
    })
    return res.status(200).json({
      ok: true,
      services
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export const createService = async (req, res) => {
  const id  = req.user;
  const { name, description, duration } = req.body;
  try {
    const service = await Service.create({
      name,
      description,
      duration,
      company_id: id
    })
    return res.status(201).json({
      ok: true,
      message: 'El servicio ha sido creado.',
      service
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export const addUserService = async (req, res) => {
  // const id  = req.user;
  const service_id = Number(req.body.service);
  const status = req.body.status;
  const { user_id } = req.params;

  try {
    const service = await Service.findByPk(service_id)
    const user = await User.findByPk(user_id)
    
    if(!service) return res.status(404).json({
      message: 'Servicio no encontrado'
    })

    const cp = await service.getCompany()
    service.due = service.duration * user.price_service;
    service.status = status;
    await service.setUser(user)
    await service.save();
    const name_user = `${user.first_name} ${user.last_name}`;
    const html = mailHTML(name_user, cp.name);
    console.log(html)

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: 'solicitud de servicio',
      html
    })

    res.status(200).json({
      ok: true,
      message: 'Solicitud de servicio envíada.'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export const acceptService = async (req, res) => {
  const id  = req.user;
  const service_id = Number(req.params.service_id);

  try {
    const service = await Service.findByPk(service_id);
    const user =await User.findByPk(id);
    
    if(!service) return res.status(404).json({
      message: 'Servicio no encontrado'
    })

    if(!user) return res.status(404).json({
      message: 'Usuario no encontrado'
    })

    const cp = await service.getCompany();
    service.set(req.body);
    await service.save();

    const name_user = `${user.first_name} ${user.last_name}`;
    const html = mailAcceptHTML(name_user, user.email, cp.name);

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: cp.email,
      subject: 'Aceptación de servicio',
      html
    })

    res.status(200).json({
      ok: true,
      message: 'Aceptación de servicio envíada.'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export const declineService = async (req, res) => {
  const id  = req.user;
  const service_id = Number(req.params.service_id);
  try {
    const service = await Service.findByPk(service_id);
    const user =await User.findByPk(id);
    
    if(!service) return res.status(404).json({
      message: 'Servicio no encontrado'
    })

    if(!user) return res.status(404).json({
      message: 'Usuario no encontrado'
    })

    const cp = await service.getCompany();
    service.user_id = null;
    service.due = 0;
    service.set(req.body);
    await service.save();

    const name_user = `${user.first_name} ${user.last_name}`;
    const html = mailDeclineHTML(name_user, cp.name);
    console.log(html)

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: cp.email,
      subject: 'Declinación de servicio',
      html
    })

    res.status(200).json({
      ok: true,
      message: 'Declinación de servicio envíada.'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}