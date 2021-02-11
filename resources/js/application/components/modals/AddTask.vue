<template>
    <v-dialog v-model="dialog" persistent max-width="450">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on" class="pl-2 my-6">
           <v-icon class="mr-2"> mdi-plus-circle-outline </v-icon> 
           <span> Ajouter une tâche </span>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="title">
            <v-row>
                <v-col>
                    Ajouter une tâche
                </v-col>
                <v-col class="text-right">
                    <v-btn icon color="dark" text @click="dialog = false"> X </v-btn>
                </v-col>
            </v-row>
        </v-card-title>

        <hr class="grey lighten-2">

        <v-card-actions>
          <v-form ref="form" lazy-validation class="formWidth">
            <v-text-field label="Titre" v-model="title" required :rules="titleRules"></v-text-field>
            <v-row>
                <v-col cols="5">
                  <v-select v-model="priority" :items="items" label="Priorité" required item-text="label" item-value="id" :rules="priorityRules"></v-select>
                </v-col>
                <v-col>
                  <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="date" label="Deadline" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-col>
            </v-row>
            <v-textarea clearable auto-grow clear-icon="mdi-close-circle" label="Description"  rows="3" required v-model="description" :rules="descriptionRules"></v-textarea>
            <div class="d-flex justify-end my-2 w-100">
              <v-btn small color="blue-grey" @click="dialog = false" class="mr-2"> Annuler </v-btn>
              <v-btn small color="primary" @click="addTask" :disabled="!isValid"> Ajouter </v-btn>
            </div>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script src="./addTask.js"></script>