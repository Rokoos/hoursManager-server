

exports.adminCheck = async (req, res, next) => {
  
  if(req.profile.role !== 'admin'){
      res.status(403).json({
          error: 'Zasoby admina.Odmowa dostępu'
      })
  }else {
      next()
  }
}