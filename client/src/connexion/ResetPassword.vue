<template>
        <v-container class="d-flex justify-center align-center" style="height:80vh; width: 100%;">
        <v-card class="mx-auto" max-width="600">
            <v-card-text class="mb-0">
                <h2 class="font-weight-black text-center"> Réinitialiser votre mot de passe </h2>
                <div v-if="!isTokenExist">
                    <p class="text-center mt-6">
                        Vous avez oublié votre mot de passe ? Ne vous inquiétez pas, vous pouvez le réinitialiser en indiquant votre adresse e-mail ci-dessous.
                    </p>
                    <p class="text-center">Un email indiquant la démarche à suivre vous sera envoyer !</p>
                </div>

                <div v-else>
                    <p class="text-center mt-6">
                        Réinitialiser vorte mot de passe ci dessous.
                    </p>
                </div>
            </v-card-text>

            <v-card-actions class="d-flex justify-center">
                <v-form ref="form" v-model="valid" lazy-validation class="formWidth">
                    <v-text-field v-model="email" :rules="emailRules"  label="Saisir votre adresse e-mail" required v-if="!isTokenExist"></v-text-field>
                    <div v-else>
                        <v-text-field type="password" v-model="password" :rules="passwordRules"  label="Nouveau mot de passe" required></v-text-field>
                        <v-text-field type="password" v-model="passwordConfirm" :rules="passwordConfirmRules"  label="Confirmation du nouveau mot de passe" required></v-text-field>
                    </div>
                    <div class="d-flex justify-end my-2 w-100">
                        <v-btn small color="blue-grey" class="mr-2" :to="loginPath"> Retour </v-btn>
                        <v-btn small color="primary" @click="sendEmail" v-if="!isTokenExist"> Réinitialiser</v-btn>
                        <v-btn small color="primary" @click="validate" v-else :disabled="!isValid"> Réinitialiser</v-btn>
                    </div>
                </v-form>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script src="./resetPassword.js"></script>