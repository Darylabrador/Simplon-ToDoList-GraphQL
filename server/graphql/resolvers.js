const bcrypt    = require('bcryptjs');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');
const dotenv    = require('dotenv').config();

const nodemailer = require('nodemailer');
const sengridTransport = require('nodemailer-sendgrid-transport');
const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

// Models imports
const User      = require('../models/user');
const Priority  = require('../models/priority');
const Task      = require('../models/task');

// Setting relation between models
User.hasMany(Task);
Priority.hasMany(Task);
Task.belongsTo(User);
Task.belongsTo(Priority);

// Send mail configuration
const transporter = nodemailer.createTransport(sengridTransport({
    auth: {
        api_key: `${process.env.API_KEY}`
    }
}));


// Custom scalar for date & dateTime
const customScalarResolver = {
    Date: GraphQLDate,
    DateTime: GraphQLDateTime
}

// Resolvers functions
module.exports = {
    customScalarResolver,
    createUser: async function ({ userInput }, req) {
        try {
            const errors   = [];

            if(!validator.isEmail()){
                errors.push({ success: false, message: 'Adresse email invalide' });
            }

            if ( validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 6 })) {
                errors.push({ success: false, message: 'Mot de passe : 6 caractères minimum' });
            }

            if (validator.isEmpty(userInput.passwordConfirm) || !validator.isLength(userInput.passwordConfirm, { min: 6 })) {
                errors.push({ success: false, message: 'Mot de passe : 6 caractères minimum' });
            }

            if (userInput.password != userInput.passwordConfirm){
                errors.push({ success: false, message: 'Les mots de passe ne sont pas identiques' });
            }

            if (errors.length > 0) {
                const error = new Error('Invalid input.');
                error.data = errors;
                error.code = 422;
                throw error;
            }

            const existingPseudo = await User.findOne({ email: userInput.pseudo });
            if (existingPseudo) {
                const error = new Error({ success: false, message: 'Pseudo existe déjà' });
                throw error;
            };

            const existingEmail = await User.findOne({ email: userInput.email });
            if (existingEmail) {
                const error = new Error({ success: false, message: 'Adresse email existe déjà' });
                throw error;
            };

            const cryptoToken = await crypto.createHmac('sha256', Date.now().toString()).update(userInput.email).digest('hex');
            const confirmToken = cryptoToken.slice(0, 15);
            const hashedPwd = await bcrypt.hash(userInput.password, 12);

            const newUser = new User({
                pseudo: userInput.pseudo,
                email: userInput.email,
                password: hashedPwd,
                confirmToken
            });

            await newUser.save();

            let url = req.protocol + '://' + req.get('host') + `/email/verification/${confirmToken}`;

            await transporter.sendMail({
                to: userInput.email,
                from: `${process.env.EMAIL_USER}`,
                subject: "ZotTodoRe - Confirmation d'inscription",
                html: `    
                <h4 style="text-align: center; width: 100%;">
                    Bienvenue ${newUser.pseudo}
                </h4>
                <p> 
                    Nous sommes heureux de vous accueillir parmi nous ! <br> 
                    Avant de pouvoir vous connecter, il faut cliquer sur le lien ci-dessous afin de confirmer votre email !
                </p>

                <p>
                    <a href="${url}"> ${url} </a>
                </p>

                <p> 
                    Cordialement, <br>
                    L'équipe de ZotTodoRe
                </p>`
            });

            return {
                success: true,
                message: 'Un email de vérification a été envoyer'
            }
        } catch (err) {
            console.log(err);
        }
    },
    updatePassword: async function({ passwordInput }, req) {
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }

            const errors = [];

            if (validator.isEmpty(passwordInput.oldPassword) || !validator.isLength(passwordInput.oldPassword, { min: 6 })) {
                errors.push({ success: false, message: 'Mot de passe : 6 caractères minimum' });
            }

            if (validator.isEmpty(passwordInput.password) || !validator.isLength(passwordInput.password, { min: 6 })) {
                errors.push({ success: false, message: 'Mot de passe : 6 caractères minimum' });
            }

            if (validator.isEmpty(passwordInput.passwordConfirm) || !validator.isLength(userInput.passwordConfirm, { min: 6 })) {
                errors.push({ success: false, message: 'Mot de passe : 6 caractères minimum' });
            }

            if (passwordInput.password != passwordInput.passwordConfirm) {
                errors.push({ success: false, message: 'Les mots de passe ne sont pas identiques' });
            }

            if (errors.length > 0) {
                const error = new Error('Invalid input.');
                error.data = errors;
                error.code = 422;
                throw error;
            }

            const existingUser = await User.findOne({ id: req.userId });
            if (!existingUser){
                const error = new Error({ success: false, message: 'Utilisateur inexistant' });
                throw error;
            }

            const isEqual      = await bcrypt.compare(passwordInput.password, existingUser.password);
            if(!isEqual) {
                const error = new Error({ success: false, message: 'Ancien mot de passe incorrecte' });
                throw error;
            }

            const hashedPwd = await bcrypt.hash(passwordInput.password, 12);
            existingUser.password = hashedPwd;
            await existingUser.save();

            let currentDate = Date.now().toString();
            let ipAdress = req.header('x-forwarded-for') || req.connection.remoteAddress;

            await transporter.sendMail({
                to: existingUser.email,
                from: `${process.env.EMAIL_USER}`,
                subject: "ZotTodoRe - Modification mot de passe",
                html: `
                <p> 
                    Bonjour ${existingUser.pseudo}, <br>
                    Votre mot de passe a été modifier le ${currentDate} depuis l'adresse IP ${ipAdress}<br>
                </p>    
                <p> 
                    Cordialement, <br>
                    L'équipe de ZotTodoRe
                </p>`
            });

            return {
                success: true,
                message: 'Mise à jour effectuée'
            }
        } catch (err) {
            console.log(err);
        }
    },
    login: async function({ email, password }, req) {
        try {
            const user = await User.findOne({ email: email });
            const isEqual = await bcrypt.compare(password, user.password);

            if (!user || !isEqual) {
                const error = new Error({ success: false, message: 'Adresse email ou mot de passe invalide' });
                throw error;
            }

            const token = jwt.sign({
                pseudo: user.pseudo,
                email: user.email,
                userId: user.id
            },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return {
                success: true,
                token
            }
        } catch (err) {
            console.log(err);
        }
    },
    logout: async function() {
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }
            req.isAuth = false;
            return true;
        } catch (err) {
            console.log(err);
        }
    },
    sendForgottenMail: async function({email}, req){
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                const error = new Error({ success: false, message: 'Adresse email inexistant' });
                throw error;
            }

            const cryptoToken = await crypto.createHmac('sha256', Date.now().toString()).update(user.email).digest('hex');
            const resetToken = cryptoToken.slice(0, 15);
            let url = req.protocol + '://' + req.get('host') + `/reset/${resetToken}`;

            user.resetToken = resetToken;
            await user.save();

            await transporter.sendMail({
                to: user.email,
                from: `${process.env.EMAIL_USER}`,
                subject: 'ZotTodoRe - Réinitialisation mot de passe',
                html: `
                <p> 
                    Bonjour ${user.pseudo}, <br>
                    Vous avez oublié votre mot de passe ? Ne vous inquiétez pas, pour réinitialiser il vous suffit 
                    de cliquer sur le lien ci-dessous : <br>
                </p>

                <a href="${url}"> ${url} </a>
                
                <p> 
                    Cordialement, <br>
                    L'équipe de ZotTodoRe 
                </p>`
            });

            return {
                success: true,
                message: "L'e-mail de réinitialisation a été envoyé"
            }
        } catch (err) {
            console.log(err);
        }
    },
    resetForgotten: async function ({ newPassword, newPasswordConfirm, resetToken }, req){
        try {
            const errors = [];

            if (validator.isEmpty(newPassword) || !validator.isLength(newPassword, { min: 6 })) {
                errors.push({ success: false, message: 'Mot de passe : 6 caractères minimum' });
            }

            if (validator.isEmpty(newPasswordConfirm) || !validator.isLength(newPasswordConfirm, { min: 6 })) {
                errors.push({ success: false, message: 'Mot de passe : 6 caractères minimum' });
            }

            if (newPassword != newPasswordConfirm ) {
                errors.push({ success: false, message: 'Les mots de passe ne sont pas identiques' });
            }

            if (errors.length > 0) {
                const error = new Error('Invalid input.');
                error.data = errors;
                error.code = 422;
                throw error;
            }

            const user = await User.findOne({ resetToken });
            if (!user) {
                const error = new Error({ success: false, message: 'Jeton invalide' });
                throw error;
            }

            const hashedPwd = await bcrypt.hash(passwordInput.password, 12);
            user.password   = hashedPwd;
            user.resetToken = null;
            await user.save();

            let currentDate = Date.now().toString();
            let ipAdress = req.header('x-forwarded-for') || req.connection.remoteAddress;

            await transporter.sendMail({
                to: user.email,
                from: `${process.env.EMAIL_USER}`,
                subject: "ZotTodoRe - Modification mot de passe",
                html: `
                <p> 
                    Bonjour ${user.pseudo}, <br>
                    Votre mot de passe a été modifier le ${currentDate} depuis l'adresse IP ${ipAdress}<br>
                </p>    
                <p> 
                    Cordialement, <br>
                    L'équipe de ZotTodoRe
                </p>`
            });

            return {
                success: true,
                message: 'Mise à jour effectuée'
            }
        } catch (err) {
            console.log(err);
        }
    },
    verifyMail: async function ({ confirmToken }, req){
        try {
            const user = await User.findOne({ confirmToken });
            if (!user) {
                const error = new Error({ success: false, message: 'Jeton invalide' });
                throw error;
            }

            if(user.verifiedAt != null) {
                const error = new Error({ success: false, message: 'Adresse e-mail déjà vérifier' });
                throw error;
            }

            user.verifiedAt = Date.now().toString();
            await user.save();

            return {
                success: true,
                message: 'Adresse e-mail vérifier avec succès'
            }
        } catch (err) {
            console.log(err);
        }
    },
    createTask: async function ({ taskInput }, req){
        try {
            const createdTask = new Task({
                title: taskInput.title,
                description: taskInput.description,
                deadline: taskInput.deadline,
                userId: req.userId,
                priorityId: taskInput.priorityId, 
            });

            const createdTaskInfo = await createdTask.save();

            const task = await Task.findOne({
                where: {id: createdTaskInfo.id},
                include: [{model: Priority},{model: User}]
            });

            return task;
        } catch (err) {
            console.log(err);
        }
    },
    updateTask: async function ({ updateTaskInput }, req){
        try {
            const taskExist = await Task.findOne({id: updateTaskInput.id});
            if (!taskExist) {
                const error = new Error({ success: false, message: 'Tâche inexistante' });
                throw error;
            }

            taskExist.title = updateTaskInput.title;
            taskExist.description = updateTaskInput.description;
            taskExist.deadline = updateTaskInput.deadline;
            taskExist.priorityId = updateTaskInput.priorityId;
            const updatedTask = await taskExist.save();

            const task = await Task.findOne({
                where: { id: updatedTask.id },
                include: [{ model: Priority }, { model: User }]
            });
            return task;
        } catch (err) {
            console.log(err);
        }
    },
    setTaskStatus: async function ({ statusTaskInput }, req){
        try {
            const taskExist = await Task.findOne({ id: statusTaskInput.id });
            if (!taskExist) {
                const error = new Error({ success: false, message: 'Tâche inexistante' });
                throw error;
            }

            taskExist.done = statusTaskInput.done;
            const updatedTask = await taskExist.save();
            
            const task = await Task.findOne({
                where: { id: updatedTask.id },
                include: [{ model: Priority }, { model: User }]
            });
            return task;
        } catch (err) {
            console.log(err);
        }
    },
    deleteTask: async function({ id }, req){
        try {
            const taskExist = await Task.findOne({ 
                where: { id },
                include: [{ model: Priority }, { model: User }]
            });
            if (!taskExist) {
                const error = new Error({ success: false, message: 'Tâche inexistante' });
                throw error;
            }

            await taskExist.destroy();
            return taskExist;
        } catch (err) {
            console.log(err);
        }
    },
    users: async function(args, req){
        try {
            const usersList = await User.findAll();
            return usersList;
        } catch (err) {
            console.log(err);
        }
    },
    user: async function({ id }, req){
        try {
            const userExist = await User.findOne({ id });
            if (!userExist) {
                const error = new Error({ success: false, message: 'Utilisateur inexistante' });
                throw error;
            }
            return userExist;
        } catch (err) {
            console.log(err);
        }
    },
    priorities: async function(args, req){
        try {
            const priorityList = await Priority.findAll();
            return priorityList;
        } catch (err) {
            console.log(err);
        }
    },
    priority: async function({ id }, req){
        try {
            const priorityExist = await Priority.findOne({ id });
            if (!priorityExist) {
                const error = new Error({ success: false, message: 'Priorité inexistante' });
                throw error;
            }
            return priorityExist;
        } catch (err) {
            console.log(err);
        }
    },
    tasks: async function(args, req){
        try {
            const taskList = await Task.findOne({
                order: [['deadline', 'ASC']],
                include: [{ model: Priority }, { model: User }]
            });
            return taskList;
        } catch (err) {
            console.log(err);
        }
    },
    filterTask: async function ({ priorityId }, req){
        try {
            const priorityExist = await Priority.findOne({ priorityId });
            if (!priorityExist) {
                const error = new Error({ success: false, message: 'Priorité inexistante' });
                throw error;
            }
            const taskList = await Task.findAll({
                where: { priorityId },
                order: [['deadline', 'ASC']],
                include: [{ model: Priority }, { model: User }]
            });
            return taskList;
        } catch (err) {
            console.log(err);
        }
    }
}