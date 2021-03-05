const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    scalar Date
    scalar DateTime
    
    type User {
        id: ID!
        pseudo: String!
        email: String!
        password: String!
        resetToken: String
        confirmToken: String!
        verifiedAt: DateTime
        created_at: DateTime
        updated_at: DateTime
        tasks: [Task!]!
    }

    type Priority {
        id: ID!
        label: String!
        tasks: [Task!]!
    }

    type Task {
        id: ID!
        title: String!
        description: String!
        deadline: Date!
        done: Boolean
        user: User!
        priority: Priority!
    }

    input UserInputData {
        pseudo: String! 
        email:  String! 
        password: String! 
        passwordConfirm: String!
    }

    input UpdatePasswordInputData {
        oldPassword: String! 
        password: String! 
        passwordConfirm: String! 
    }

    input TaskInputData {
        title: String!
        description: String!
        deadline: Date!
        priorityId: Int!
    }

    input UpdateTaskInputData {
        id: ID!
        title: String!
        description: String!
        deadline: Date!
        priorityId: Int!
    }

    input TaskStatusInputData {
        id: ID! 
        done: Boolean!
    }

    type RootQuery {
        users: [User!]!
        priorities: [Priority!]!
        tasks: [Task!]!
        user(id: ID!): User
        priority(id: ID!): Priority
        filterTask(priorityId: Int!): [Task!]!
    }

    type RootMutation {
        createUser(userInput: UserInputData): [String!]
        updatePassword(passwordInput: UpdatePasswordInputData): String
        login(email: String!, password: String!): [String!]
        logout: Boolean
        sendForgottenMail(email: String): String
        resetForgotten(newPassword: String!, newPasswordConfirm: String!, resetToken: String!): String
        verifyMail(confirmToken: String! ): [String!]
        createTask(taskInput: TaskInputData): Task
        updateTask(updateTaskInput: UpdateTaskInputData): Task
        setTaskStatus(statusTaskInput: TaskStatusInputData): Task
        deleteTask(id: ID!): Task
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);