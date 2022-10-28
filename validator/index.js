


exports.signupValidator = (req, res, next) => {
    req.check('userName', "Podaj imię i nazwisko.")
    
    req.check('companyName', "Podaj nazwę firmy. Min 4 znaki")
    .notEmpty()
    .isLength({
        min: 4,
        max: 100
    })
    req.check('email', "Podaj email!")
    .matches(/.+\@.+\..+/)
    .withMessage('Email musi zawierać @ i minimum 4 znaki!')
    .isLength({
        min: 4,
        max: 30
    })
    

    req.check('password', "Utwórz hasło").notEmpty()
    req.check('password')
    .isLength({
        min: 6
    })
    .withMessage('Hasło musi mieć przynajmniej 6 znaków!')
    .matches(/\d/)
    .withMessage('Hasło musi zawierać cyfrę!')


     //check for errors
     const errors = req.validationErrors()
     //if errors show the first one as they happen
     if(errors){
         const firstError = errors.map(error => error.msg)[0]
         return res.status(400).json({error: firstError})
     }
 
     next()
}