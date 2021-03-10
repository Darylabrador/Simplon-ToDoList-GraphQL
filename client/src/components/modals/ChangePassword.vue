<template>
    <v-dialog v-model="dialog" persistent max-width="450">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">
            Modification mot de passe
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="title">
            <v-row>
                <v-col cols="10">
                    <h5> Changement du mot de passe </h5>
                </v-col>
                <v-col class="text-right">
                    <v-btn icon color="dark" text @click="dialog = false"> X </v-btn>
                </v-col>
            </v-row>
        </v-card-title>

        <hr class="grey lighten-2">

        <v-card-actions>
          <v-form ref="form" lazy-validation class="formWidth">
            <v-text-field type="password" label="Ancien mot de passe" v-model="oldPassword" required :rules="oldPasswordRules"></v-text-field>
            <v-text-field type="password" label="Nouveau mot de passe" v-model="newPassword" required :rules="newPasswordRules"></v-text-field>
            <v-text-field type="password" label="Confirmation mot de passe" v-model="newPasswordConfirm" required :rules="newPasswordConfirmRules"></v-text-field>
            <div class="d-flex justify-end my-2 w-100">
              <v-btn small color="blue-grey" @click="dialog = false" class="mr-2"> Annuler </v-btn>
              <v-btn small color="primary" @click="changePassword" :disabled="!isValid"> Modifier </v-btn>
            </div>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script src="./changePassword.js"></script>