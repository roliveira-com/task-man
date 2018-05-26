module.exports = async function (req, res, proceed) {

  if (req.session.user) {
    return proceed();
  }

  req.session.error = 'Você precisa estar logado para acessar aquela página';
  res.redirect('/');
  return;

};