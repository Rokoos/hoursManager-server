const User = require('../models/user')
const sgMail = require("@sendgrid/mail");
require('dotenv').config()

exports.userById = (req, res, next, id) => {
    // console.log('id', id)
    User.findById(id)
    .exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "Nie znaleziono użytkownika"
            })
        }

        req.profile = user // adds profile object in req with user info
        next()
    })
}

exports.usersByCompany = (req, res) => {
  User.find({companyName: req.profile._id})
  .select('_id userName companyName data email')
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

exports.handleHours = async (req, res) => {

    const {year, week} = req.body

    try {
        const user = await User.findById({_id: req.params.userId})

        const weekExists = user.data.find(el => {
            return el.year == year && el.week == week
        })

        if(!weekExists){
            const updatedUser = await User.findOneAndUpdate({_id: req.params.userId},{$push :{data: req.body} },
                {new: true})
                .exec()

            const unique = [...new Set(updatedUser.data.map(item => item.year))]


            sgMail.setApiKey(process.env.SENGRID_API_KEY);

            const admin = await User.findOne({_id: req.profile.companyName})

            
            const msgToUser = {
                to:  req.profile.email,
                from: "myhoursmanager@gmail.com",
                subject: `Dodano godziny dla ${week} tygodnia.`,
                text: `Witaj ${req.profile.userName}. Pomyślnie dodano przepracowane godziny dla ${week} tygodnia ${year} roku.`
            };
            
            const msgToAdmin = {
                to:  admin.email,
                from: "myhoursmanager@gmail.com",
                subject: `${req.profile.userName} dodal godziny dla ${week} tygodnia.`,
                text: `Witaj ${admin.userName}. ${req.profile.userName} pomyślnie dodał przepracowane godziny dla ${week} tygodnia ${year} roku. Możesz je sprawdzić logując się na swoje konto.`
            }   
                
            sgMail.send(msgToUser)
            .then(response => {
                console.log('Email to user...')
                sgMail.send(msgToAdmin)
                .then(response => console.log('Email to admin'))
                .catch(error => console.log(error))
                    })
            .catch(error => console.log(error))
                
            res.json({updatedUser,unique})

           }else{
            res.status(400).json({error: `Dane ${week} tygodnia ${year} roku zostały juz dodane.`})
           }

           

    } catch (error) {
        res.status(400).json({error: `Error`})
    }

}

exports.getData = async (req, res) => {

   const weeks = req.profile.data.filter(el => el.year == req.params.year)

   const months = []

    

    weeks.map(item => {
    return item.days.map(day => {
        months.push(Number(day[0].substring(day[0].length , day[0].length - 2)))
    } )
   })
   const uniqueMonths = [...new Set(months)]

   res.json({weeks, uniqueMonths})

}



exports.getMonth = async (req, res) => {
    const {month} = req.params

    const weeks = req.profile.data.filter(el => el.year == req.params.year)

    let asia = []
    let troll = []
weeks.forEach(week  => asia.push(week.days))

asia.forEach(item => {
    item.forEach(el => troll.push(el))

  })


const newArr = troll.filter(el => Number(el[0].substring(el[0].length, el[0].length - 2)) == month )

let total = 0

newArr.forEach(el => total += el[1]

)

  res.json({month: newArr, total})
}







exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    const unique = [...new Set(req.profile.data.map(el => el.year))]
    return res.json({user: req.profile,unique})
}


exports.deleteUser = async (req, res) => {

    try {
        const deletedUser = await User.findOneAndRemove({_id: req.params.userId}).exec()

        const admin = await User.findById(deletedUser.companyName)

        sgMail.setApiKey(process.env.SENGRID_API_KEY);
        const msgToUser = {
            to:  deletedUser.email,
            from: "myhoursmanager@gmail.com",
            subject: `Konto zostało pomyślnie usunięte.`,
            text: `Twoje konto zostało pomyślnie usunięte z naszego serwisu. Do zobaczenia ponownie ${deletedUser.userName}.`
        };
        
        const msgToAdmin = {
            to:  admin.email,
            from: "myhoursmanager@gmail.com",
            subject: `${deletedUser.userName} usunął konto.`,
            text: `Witaj ${admin.userName}. Użytkownik ${deletedUser.userName} usunął konto z naszego serwisu. `
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
        console.log(err)
        res.status(400).send('Wystąpił błąd. Spróbuj ponownie później.')
    }

}