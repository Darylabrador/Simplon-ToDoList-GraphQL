<template>
    <v-dialog v-model="dialog" persistent max-width="450">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="dark" v-bind="attrs" v-on="on">
            <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="title">
            <v-row>
                <v-col>
                    Tâche à effectuer
                </v-col>
                <v-col class="text-right">
                    <v-btn icon color="dark" text @click="closeModal"> X </v-btn>
                </v-col>
            </v-row>
        </v-card-title>

        <hr class="grey lighten-2">

        <v-card-actions>
          <v-form ref="form" lazy-validation class="formWidth">
            <v-text-field :disabled="!isUpdate" label="Titre" v-model="title" required :rules="titleRules"></v-text-field>
            <v-row>
                <v-col cols="5">
                  <v-select :disabled="!isUpdate" v-model="priority" :items="items" label="Priorité" required item-text="label" item-value="id" :rules="priorityRules" persistent-hint></v-select>
                </v-col>
                <v-col>
                  <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field :disabled="!isUpdate" v-model="date" label="Deadline" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker :disabled="!isUpdate" v-model="date" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-col>
            </v-row>
            <v-textarea :disabled="!isUpdate"  auto-grow clear-icon="mdi-close-circle" label="Description"  rows="3" required v-model="description" :rules="descriptionRules"></v-textarea>
            <div class="d-flex justify-end my-2 w-100">
              <v-btn small color="blue-grey" @click="isUpdate = false" class="mr-2" v-if="isUpdate"> Annuler </v-btn>
              <v-btn small color="blue-grey" @click="closeModal" class="mr-2" v-else> Annuler </v-btn>
              <v-btn small color="primary" @click="isUpdate = true" v-if="!isUpdate"> Modifier </v-btn>
              <v-btn small color="primary" @click="updateTask" v-else> Sauvegarder </v-btn>
            </div>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script src="./detailTask.js"></script>