'use strict';

module.exports = (plugin) => {
  const forgotPassword = plugin.controllers.auth.forgotPassword;

  plugin.controllers.auth.forgotPassword = async (ctx) => {
    const { email } = ctx.request.body;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    await strapi.plugins['users-permissions'].services.user.sendEmailConfirmation = null;

    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email } });

    if (!user) {
      return ctx.send({ ok: true, message: 'If that email exists, a link has been sent.' });
    }

    // Use default service but customize reset URL
    const resetPasswordToken = await strapi.plugins['users-permissions'].services.jwt.issue({
      id: user.id,
    });

    await strapi.plugins['email'].services.email.send({
      to: user.email,
      subject: 'Redefinir sua senha',
      html: `
        <p>Olá ${user.username || ''},</p>
        <p>Você solicitou a redefinição de senha da sua conta Classe A Company.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <p><a href="${frontendUrl}/reset-password?code=${resetPasswordToken}">Redefinir senha</a></p>
        <p>Se você não fez esta solicitação, ignore este e-mail.</p>
      `,
    });

    ctx.send({ ok: true });
  };

  return plugin;
};
