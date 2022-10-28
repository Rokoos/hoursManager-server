const User = require('../models/user')

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
        // console.log('user', user)
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
    // console.log('req', req.body)
    const {year, week} = req.body
   

        //     const user = await User.findById({_id: req.params.userId})

        //    const weekExists = user.data.find(el => {
        //     return el.year == year && el.week == week
        //    })
        // //    console.log('week', weekExists)

        //    if(!weekExists){
        //      const updatedUser = await user.updateOne({$push :{data: req.body} },
        //         {new: true})
        //         .exec(async (err, result) => {
        //             if(err){
        //                 return res.status(400).json({
        //                     error: err
        //                 })
        //             }else{
        //                 await user.save()
                        // const unique = [...new Set(user.data.map(item => item.year))]
                        // console.log('uniq', unique)
        //                 res.json(user)
        //                 req.profile = user

        //             }
        //         })
        //    }else{
        //     return res.status(400).json({error: `Dane ${week} tygodnia ${year} roku zostały juz dodane.`})
        //    }

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
                // console.log('uniq', unique)
                // console.log('user',updatedUser)

                res.json({updatedUser,unique})
           }else{
            res.status(400).json({error: `Dane ${week} tygodnia ${year} roku zostały juz dodane.`})
           }

           

           } catch (error) {
            res.status(400).json({error: `Error`})
           }

}

exports.getData = async (req, res) => {
    // console.log('req.body', req.body)
    // console.log('req.params', req.params)
    // console.log('user.profile', req.profile)

   const weeks = req.profile.data.filter(el => el.year == req.params.year)

   const months = []

    // Number(str.substring(str.length , str.length - 2));

    weeks.map(item => {
    return item.days.map(day => {
        months.push(Number(day[0].substring(day[0].length , day[0].length - 2)))
    } )
   })
   const uniqueMonths = [...new Set(months)]

//    console.log('months', months)
//    console.log('uniqueMonths', uniqueMonths)

   res.json({weeks, uniqueMonths})

}

exports.getMonth = async (req, res) => {
    // console.log('req.params', req.params)
    const {month} = req.params

    const weeks = req.profile.data.filter(el => el.year == req.params.year)

    let asia = []
    let troll = []
weeks.forEach(week  => asia.push(week.days))
// console.log('weeks', weeks)

asia.forEach(item => {
    item.forEach(el => troll.push(el))

  })

//   const newArr = troll.filter(el => Number(el.substring(el.length, el.length - 2) == month))
const newArr = troll.filter(el => Number(el[0].substring(el[0].length, el[0].length - 2)) == month )

let total = 0

newArr.forEach(el => total += el[1]

)

  res.json({month: newArr, total})
}





exports.jajco = (req, res) => {
    console.log('NAANANANNANANANANA')
    console.log('reg', req.body)
    // console.log('res', res.json({message: 'I gitara'}))
    return res.json(req.body)
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    const unique = [...new Set(req.profile.data.map(el => el.year))]
    // console.log('profile', req.profile)
    return res.json({user: req.profile,unique})
}