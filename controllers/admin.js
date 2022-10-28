const User = require('../models/user')


exports.getEmployee = async (req, res) => {

try {
  const users = await User.find({companyName: req.profile._id})
  .select('_id userName companyName data email')

  if(users.length > 0){
    const searchedUser = users.find(user => user._id == req.params.id)

    if(searchedUser){
      const years = [...new Set(searchedUser.data.map(item => item.year))]

      
      res.json({searchedUser,years})
    }

  }

} catch (error) {
  res.status(400).json({error: `Nie znaleziono pracownika`})
}


}

exports.getEmployeeWeeks = async (req, res) => {

  try {

    const user = await User.findOne({_id: req.params.id})
    if(!user){
      res.status(404).res.json({message: 'Nima takiego dziada'})
    }

    const weeks = user.data.filter(el => el.year == req.params.year)

    const months = []


    weeks.map(item => {
    return item.days.map(day => {
        months.push(Number(day[0].substring(day[0].length , day[0].length - 2)))
    } )
   })
   const uniqueMonths = [...new Set(months)]

   res.json({weeks, uniqueMonths})
  
  } catch (error) {
    res.status(400).json(error)
  }
}
