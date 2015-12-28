module.exports = function (req, res, next) {
  if (req.user.permissionLevel >= 5) { return next(); }
  res.render('error/error', {
    title: 'Insufficient permissions',
    message: 'Sorry. You need permission level greater than or equal to 5 to create new users.',
    link: '/',
    linkText: 'Take me Home'
  });
};
