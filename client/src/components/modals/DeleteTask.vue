<template>
    <v-dialog v-model="dialog" persistent max-width="450">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="dark" v-bind="attrs" v-on="on">
            <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="title">
            <v-row>
                <v-col class="text-right">
                    <v-btn icon color="dark" text @click="dialog = false"> X </v-btn>
                </v-col>
            </v-row>
        </v-card-title>

        <v-card-actions>
          <v-form ref="form" lazy-validation class="formWidth">
              <h4 class="text-center"> Voulez-vous vraiment supprimer cette tâche ? </h4>
              <p class="text-center"> {{ taskTitle }} </p>
            <div class="d-flex justify-end my-2 w-100">
              <v-btn small color="blue-grey" @click="dialog = false" class="mr-3"> Non </v-btn>
              <v-btn small color="primary" @click="deleteTask"> Oui </v-btn>
            </div>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script src="./deleteTask.js"></script>