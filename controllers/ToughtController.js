const { raw } = require('mysql2');
const Tought = require('../models/Tought');
const User = require('../models/User');

module.exports = class ToughtController {
    static async showToughts(req, res) {
        res.render('toughts/home');
    }
    static async dashbord(req, res) {
        const userId = req.session.userid

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Tought,
            plain: true,
        })

        // check user exists
        if (!user) {
            res.redirect('/login')
        } 

        const toughts = user.Toughts.map((result) => result.dataValues)

        let emptyToughts = false;

        if (toughts.length === 0) {
            emptyToughts = true;
        }

        res.render('toughts/dashbord', { toughts, emptyToughts});
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }
    static async createToughtSave(req,res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid,
        }
        try {
            await Tought.create(tought)

            req.flash('message', 'Pensamento criado com sucesso' )
    
            req.session.save(() => {
                res.redirect('/toughts/dashbord')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async removeToughts(req, res) {

        const id = req.body.id;
        const userid = req.session.userid

        try {
            await Tought.destroy({where: {id: id, userid: userid}})
            req.flash('message', 'Pensamento removido com sucesso' )
    
            req.session.save(() => {
                res.redirect('/toughts/dashbord')
            })
        } catch (error) {
            console.log(error)
        }

    }

    static async udpateTought(req, res) {
        const id = req.params.id

        const tought = await Tought.findOne({where:{id:id}, raw: true})

        res.render('toughts/edit', {tought})

    }

    static async udpateToughtSave(req, res) {
        
        const id = req.body.id

        const tought = {
            title: req.body.title

        }

        try {
            await Tought.update(tought, {where: {id : id}})
            req.flash('message', 'Pensamento alterado com sucesso' )
    
            req.session.save(() => {
                res.redirect('/toughts/dashbord')
            })
        } catch (error) {
            console.log(error)
        }


    }

}