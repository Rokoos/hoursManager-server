
const User = require('../models/user')

// exports.authCheck = async (req, res, next) => {
  
//   try {
//     const user = await admin
//         .auth()
//         .verifyIdToken(req.headers.authtoken)
//     //  console.log('FIREBASE USER', firebaseUser)  
//      req.user = firebaseUser 
//      next()
// } catch (err) {
//     console.log(err)
//     res.status(401).json({
//         err: 'Invalid or expired token.'
//     })
// }
// }





exports.adminCheck = async (req, res, next) => {
  
  

  if(req.profile.role !== 'admin'){
      res.status(403).json({
          error: 'Zasoby admina.Odmowa dostępu'
      })
  }else {
    // console.log('sialalalalala')
      next()
  }
}