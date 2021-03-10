<template >
    <v-container class="d-flex justify-center align-center" style="height:80vh; width: 100%;">
        <v-card class="mx-auto" width="500">
            <v-card-text>
                <h2 class="font-weight-black text-center"> Inscription </h2>
            </v-card-text>

            <v-card-actions class="d-flex justify-center">
                <v-form ref="form" v-model="valid" lazy-validation class="formWidth">
                    <v-row>
                        <v-col cols="5">
                            <v-text-field v-model="pseudo" :rules="pseudoRules"  label="Pseudo" required></v-text-field>
                        </v-col>

                        <v-col>
                            <v-text-field v-model="email" :rules="emailRules"  label="Adresse e-mail" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-text-field type="password" v-model="password" :rules="passwordRules" label="Mot de passe" required></v-text-field>
                    <v-text-field type="password" v-model="passwordConfirm" :rules="passwordConfirmRules" label="Confirmation mot de passe" required></v-text-field>

                    <div class="d-flex justify-end my-2 w-100">
                        <v-btn small color="blue-grey" class="mr-2" :to="loginPath"> Retour </v-btn>
                        <v-btn small color="primary" @click="validate"> Inscription </v-btn>
                    </div>
                </v-form>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script src='./register.js'></script>