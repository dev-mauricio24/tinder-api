import nodemailer from 'nodemailer'


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

export const mailHTML = (user = '', company = '') => {
  return `
  <p>Hola ${user} la empresa ${company} te ha enviado una solicitud de servicio.</p>
  <p>Inicia sesión en la plataforma y revisa esta nueva oportunidad.</p>
  <a href="http://127.0.0.1:5500/profile.html">Ir a la plataforma</a>
  <p>Si no puedes visualizar la información, por favor actualiza el navegador.</p>
  <p><strong> Mucha suerte con esta nueva oportunidad.</strong></p>
  `
}

export const mailAcceptHTML = (user = '', email = '', company = '') => {
  return `
  <p>Equipo ${company}, ${user} ha aceptado la solicitud de servicio.</p>
  <p>Contáctalo(a) a través del siguinte correo ${email} para dar inicio a tu servicio.</p>
  <p><strong> Mucha suerte!</strong></p>
  `
}

export const mailDeclineHTML = (user = '', company = '') => {
  return `
  <p>Equipo ${company}, ${user} ha declinado la solicitud de servicio.</p>
  <p>Sigue buscando los mejores talentos disponibles en la plataforma.</p>
  <p><strong> Mucha suerte!</strong></p>
  `
}
