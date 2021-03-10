<template>
    <v-container class="d-flex justify-center align-center" style="height:80vh; width: 100%;">
        <v-card class="mx-auto" width="450">
            <v-card-text>
                <h3 class="font-weight-black text-center"> {{ message }} </h3>
            </v-card-text>

            <v-card-actions class="d-flex justify-center">
                <v-btn small color="blue-grey" class="mr-2" :to="loginPath"> Retour </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script src="./verifyEmail.js"></script>