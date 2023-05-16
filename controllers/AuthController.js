const User = require('../models/User');
const bcrypt = require('bcryptjs') ;

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login');
    }
    static async loginPost(req, res) {
        const { email, password} = req.body

        //usuario existe?
        const user = await User.findOne({where: {email: email}})

        if(!user) {
            req.flash('message', 'E-mail ou senha invalidos');
            res.render('auth/login');

            return
        }

        //Verificacao de senha

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash('message','Senha invalida!');
            res.render('auth/login');

            return 
        }
            //inicializar sessão
            req.session.userid = user.id

            req.flash('message', 'Autenticação realizada com sucessso!');

            req.session.save(() => {
                res.redirect('/');
            })
        
    }

    static register(req, res) {
        res.render('auth/register');
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword}  = req.body

        // validation password
        if (password != confirmpassword) {
            // mensages
            req.flash('message', 'Senhas não conferem!');
            res.render('auth/register');

            return
        }

        //chek user email
        const checkIfUserExists = await User.findOne({ where: { email : email}})
        if (checkIfUserExists) {
            req.flash('message', 'Email já cadastrado!');
            res.render('auth/register');

            return
        }

        // creat a password user

        const salt = bcrypt.genSaltSync(10);
        const hasheadPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hasheadPassword,
        }

        try {
            const createUser = await User.create(user);

            //inicializar sessão
            req.session.userid = createUser.id

            req.flash('message', 'Usuário cadastrado com sucesso!');

            req.session.save(() => {
                res.render('toughts/home');
            })

        } catch (err) {
            console.log(err);
        }
        
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login');
    }
}