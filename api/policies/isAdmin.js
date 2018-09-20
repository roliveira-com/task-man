module.exports = async function (req, res, proceed) {

  if (!req.session.user) {
    req.session.error = 'Você precisa estar logado para acessar aquela página';
    res.redirect('/');
    return;
  }

  if (req.session.user.role != 'admin') {
    req.session.error = 'Você precisa não tem privilégios suficientes para acessar aquela página';
    res.redirect('/');
    return;
  }

  if (req.session.user.role == 'admin') {
    return proceed();
  }
  
};