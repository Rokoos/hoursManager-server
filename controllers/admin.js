const User = require('../models/user')
const sgMail = require("@sendgrid/mail");

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
      res.status(404).res.json({message: 'Nie znaleziono użytkownika'})
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

exports.deleteAdmin = async (req, res) => {

  const admin = await User.findOneAndDelete({_id: req.params.userId}).exec()

  sgMail.setApiKey(process.env.SENGRID_API_KEY);

  const deletedUsers = await User.find({companyName: req.params.userId})
  .exec()

  if(deletedUsers.length > 0){

    deletedUsers.forEach(user => {

      const msgToUser = {
        to:  user.email,
        from: "myhoursmanager@gmail.com",
        subject: `Twoje konto zostało usunięte.`,
        text: `Firma ${admin.companyName} usunęła swoje konto z naszego serwisu. W związku w powyższym każde konto zarejestrowane na firmę ${admin.companyName} również zostało usunięte.`
    };
  
    sgMail.send(msgToUser)
      .then(response => console.log('Email to user...'))
      .catch(error => console.log(error))

      user.remove()
  
    })

    

  }

  
  const msgToAdmin = {
    to:  admin.email,
    from: "myhoursmanager@gmail.com",
    subject: `Konto Twojej firmy zostało usunięte.`,
    text: `Konto firmy ${admin.companyName} zostało usunięte z naszego serwisu jak również każde konto zarejestrowane na tę firmę. Mamy nadzieję że w przyszłości ponownie skorzystasz z naszych usług. Do zobaczenia!`
}  

  sgMail.send(msgToAdmin)
      .then(response => console.log('Email to admin...'))
      .catch(error => console.log(error))

  res.json({admin, deletedUsers})

}




exports.deleteUserByAdmin = async (req, res) => {
  

  try {
      const deletedUser = await User.findOneAndRemove({_id: req.params.id}).exec()

      const admin = await User.findById(req.params.userId)

      sgMail.setApiKey(process.env.SENGRID_API_KEY);

      const msgToUser = {
          to:  deletedUser.email,
          from: "myhoursmanager@gmail.com",
          subject: `Twoje konto zostało usunięte.`,
          text: `Twoje konto zostało usunięte z naszego serwisu przez administratora firmy ${admin.companyName}.`
      };
      
      const msgToAdmin = {
          to:  admin.email,
          from: "myhoursmanager@gmail.com",
          subject: `Konto ${deletedUser.userName} zostało usunięte.`,
          text: `Witaj ${admin.userName}. Konto ${deletedUser.userName} zostało usunięte z naszego serwisu.`
      }   
          
      sgMail.send(msgToUser)
      .then(response => {
          console.log('Email to user...')
          sgMail.send(msgToAdmin)
          .then(response => console.log('Email to admin'))
          .catch(error => console.log(error))
              })
      .catch(error => console.log(error))

      
      res.json(deletedUser)
  } catch (error) {
      console.log(error)
      res.status(400).send('Wystąpił błąd. Spróbuj ponownie później.')
  }

}
