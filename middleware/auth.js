/**
 * Verifica se o utilizador está autenticado e tem o perfil correto.
 * Equivalente à função checkAuth() do auth.php original.
 */
function checkAuth(role) {
  return (req, res, next) => {
    if (!req.session.user_id) {
      return res.redirect('/login');
    }
    if (role && req.session.role !== role) {
      return res.redirect('/');
    }
    next();
  };
}

module.exports = { checkAuth };
