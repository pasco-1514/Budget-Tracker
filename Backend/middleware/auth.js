exports.ensureLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ success: false, message: 'Please log in' });
  };
  exports.ensureLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.status(400).json({ success: false, message: 'Already logged in' });
  };
  