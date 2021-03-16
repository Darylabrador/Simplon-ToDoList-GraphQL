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
Task.belongsTo(User, {foreignKey: 'userId', as: 'user'});
Task.belongsTo(Priority, {foreignKey: 'priorityId', as: 'priority'});

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

            if(!validator.isEmail(userInput.email)){
                errors.push('Adresse email invalide');
            }

            if ( validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 6 })) {
                errors.push('Mot de passe : 6 caractères minimum' );
            }

            if (validator.isEmpty(userInput.passwordConfirm) || !validator.isLength(userInput.passwordConfirm, { min: 6 })) {
                errors.push('Mot de passe : 6 caractères minimum');
            }

            if (userInput.password != userInput.passwordConfirm){
                errors.push('Les mots de passe ne sont pas identiques');
            }

            if (errors.length > 0) {
                const error = new Error('Invalid input.');
                error.data = errors;
                error.code = 422;
                throw error;
            }

            const existingPseudo = await User.findOne({ where: {pseudo: userInput.pseudo }});
            if (existingPseudo) {
                const error = new Error('Pseudo existe déjà');
                throw error;
            };

            const existingEmail = await User.findOne({ where: {email: userInput.email}});
            if (existingEmail) {
                const error = new Error('Adresse email existe déjà');
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

            return  'Un email de vérification a été envoyer';
        } catch (err) {
            console.log(err)
            throw err;
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
                errors.push('Mot de passe : 6 caractères minimum');
            }

            if (validator.isEmpty(passwordInput.password) || !validator.isLength(passwordInput.password, { min: 6 })) {
                errors.push('Mot de passe : 6 caractères minimum');
            }

            if (validator.isEmpty(passwordInput.passwordConfirm) || !validator.isLength(passwordInput.passwordConfirm, { min: 6 })) {
                errors.push('Mot de passe : 6 caractères minimum');
            }

            if (passwordInput.password != passwordInput.passwordConfirm) {
                errors.push('Les mots de passe ne sont pas identiques');
            }

            if (errors.length > 0) {
                const error = new Error('Invalid input.');
                error.data = errors;
                error.code = 422;
                throw error;
            }

            const existingUser = await User.findOne({ where: { id: req.userId } });
            if (!existingUser){
                const error = new Error('Utilisateur inexistant');
                throw error;
            }

            const isEqual = await bcrypt.compare(passwordInput.oldPassword, existingUser.password);
            if(!isEqual) {
                const error = new Error('Ancien mot de passe incorrecte' );
                throw error;
            }

            const hashedPwd = await bcrypt.hash(passwordInput.password, 12);
            existingUser.password = hashedPwd;
            await existingUser.save();

            await transporter.sendMail({
                to: existingUser.email,
                from: `${process.env.EMAIL_USER}`,
                subject: "ZotTodoRe - Modification mot de passe",
                html: `
                <p> 
                    Bonjour ${existingUser.pseudo}, <br>
                    Votre mot de passe a été modifier !<br>
                </p>    
                <p> 
                    Cordialement, <br>
                    L'équipe de ZotTodoRe
                </p>`
            });

            return  'Mise à jour effectuée';
        } catch (err) {
            throw err;
        }
    },
    login: async function({ email, password }, req) {
        try {
            const user = await User.findOne({ where: { email: email }});
            const isEqual = await bcrypt.compare(password, user.password);

            if (!user || !isEqual) {
                const error = new Error('Adresse email ou mot de passe invalide');
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

            return token;
        } catch (err) {
            throw err;
        }
    },
    logout: async function(args, req) {
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }
            req.isAuth = false;
            return true;
        } catch (err) {
            throw err;
        }
    },
    sendForgottenMail: async function({email}, req){
        try {
            const user = await User.findOne({ where: { email }});
            if (!user) {
                const error = new Error('Adresse email inexistant');
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

            return  "L'e-mail de réinitialisation a été envoyé";
        } catch (err) {
            throw err;
        }
    },
    resetForgotten: async function ({ newPassword, newPasswordConfirm, resetToken }, req){
        try {
            const errors = [];

            if (validator.isEmpty(newPassword) || !validator.isLength(newPassword, { min: 6 })) {
                errors.push('Mot de passe : 6 caractères minimum');
            }

            if (validator.isEmpty(newPasswordConfirm) || !validator.isLength(newPasswordConfirm, { min: 6 })) {
                errors.push('Mot de passe : 6 caractères minimum');
            }

            if (newPassword != newPasswordConfirm ) {
                errors.push('Les mots de passe ne sont pas identiques');
            }

            if (errors.length > 0) {
                const error = new Error('Invalid input.');
                error.data = errors;
                error.code = 422;
                throw error;
            }

            const user = await User.findOne({ where: { resetToken }});
            if (!user) {
                const error = new Error('Jeton invalide');
                throw error;
            }

            const hashedPwd = await bcrypt.hash(newPassword, 12);
            user.password   = hashedPwd;
            user.resetToken = null;
            await user.save();

            await transporter.sendMail({
                to: user.email,
                from: `${process.env.EMAIL_USER}`,
                subject: "ZotTodoRe - Modification mot de passe",
                html: `
                <p> 
                    Bonjour ${user.pseudo}, <br>
                    Votre mot de passe a été modifier !<br>
                </p>    
                <p> 
                    Cordialement, <br>
                    L'équipe de ZotTodoRe
                </p>`
            });

            return  'Mise à jour effectuée';
        } catch (err) {
            throw err;
        }
    },
    verifyMail: async function ({ confirmToken }, req){
        try {
            const user = await User.findOne({ where: { confirmToken }});
            if (!user) {
                const error = new Error('Jeton invalide');
                throw error;
            }

            if(user.verifiedAt != null) {
                const error = new Error('Adresse e-mail déjà vérifier');
                throw error;
            }

            user.verifiedAt = Date.now().toString();
            await user.save();

            return  'Adresse e-mail vérifier avec succès';
        } catch (err) {
            throw err;
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
                include: [{ model: Priority, as: 'priority' }, { model: User, as: 'user' }]
            });

            return task;
        } catch (err) {
            throw err;
        }
    },
    updateTask: async function ({ updateTaskInput }, req){
        try {
            const taskExist = await Task.findOne({ where: { id: updateTaskInput.id }});
            if (!taskExist) {
                const error = new Error('Tâche inexistante');
                throw error;
            }

            taskExist.title = updateTaskInput.title;
            taskExist.description = updateTaskInput.description;
            taskExist.deadline = updateTaskInput.deadline;
            taskExist.priorityId = updateTaskInput.priorityId;
            const updatedTask = await taskExist.save();

            const task = await Task.findOne({
                where: { id: updatedTask.id },
                include: [{ model: Priority, as: 'priority' }, { model: User, as: 'user' }]
            });
            return task;
        } catch (err) {
            throw err;
        }
    },
    setTaskStatus: async function ({ statusTaskInput }, req){
        try {
            const taskExist = await Task.findOne({ where: { id: statusTaskInput.id }});
            if (!taskExist) {
                const error = new Error('Tâche inexistante');
                throw error;
            }

            taskExist.done = statusTaskInput.done;
            const updatedTask = await taskExist.save();
            
            const task = await Task.findOne({
                where: { id: updatedTask.id },
                include: [{ model: Priority, as: 'priority' }, { model: User, as: 'user' }]
            });
            return task;
        } catch (err) {
            throw err;
        }
    },
    deleteTask: async function({ id }, req){
        try {
            const taskExist = await Task.findOne({ 
                where: { id },
                include: [{ model: Priority, as: 'priority' }, { model: User, as: 'user' }]
            });
            if (!taskExist) {
                const error = new Error('Tâche inexistante');
                throw error;
            }

            await taskExist.destroy();
            return taskExist;
        } catch (err) {
            throw err;
        }
    },
    users: async function(args, req){
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }
            const usersList = await User.findAll();
            return usersList;
        } catch (err) {
            throw err;
        }
    },
    user: async function({ id }, req){
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }
            const userExist = await User.findOne({ where: { id } });
            if (!userExist) {
                const error = new Error('Utilisateur inexistante');
                throw error;
            }
            return userExist;
        } catch (err) {
            throw err;
        }
    },
    priorities: async function(args, req){
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }
            const priorityList = await Priority.findAll();
            return priorityList;
        } catch (err) {
            throw err;
        }
    },
    priority: async function({ id }, req){
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }
            const priorityExist = await Priority.findOne({ where: { id } });
            if (!priorityExist) {
                const error = new Error('Priorité inexistante');
                throw error;
            }
            return priorityExist;
        } catch (err) {
            throw err;
        }
    },
    tasks: async function(args, req){
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }
            const taskList = await Task.findAll({
                order: [['deadline', 'ASC']],
                include: [{ model: Priority, as: 'priority' }, { model: User, as: 'user' }]
            });

            return taskList;
        } catch (err) {
            throw err;
        }
    },
    filterTask: async function ({ priorityId }, req){
        try {
            if (!req.isAuth) {
                const error = new Error('Not authenticated');
                error.code = 401;
                throw error;
            }
            const priorityExist = await Priority.findOne({ where: { id: priorityId } });
            if (!priorityExist) {
                const error = new Error('Priorité inexistante');
                throw error;
            }
            const taskList = await Task.findAll({
                where: { priorityId },
                order: [['deadline', 'ASC']],
                include: [{ model: Priority, as: 'priority' }, { model: User, as: 'user' }]
            });
            return taskList;
        } catch (err) {
            throw err;
        }
    }
}