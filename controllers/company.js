const User = require('../models/user')

exports.getCompanies = (req, res) => {
  // console.log('_id', req.params.id)
  User.find({role: 'admin'})
  .select('_id userName companyName email')
  .sort("-created")
  .exec((err, users) => {
      if(err){
          return res.status(400).json({
              error: err
          })
      }

      res.json(users)
  })
}