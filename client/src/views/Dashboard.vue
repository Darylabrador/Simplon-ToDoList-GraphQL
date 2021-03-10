<template>
    <v-container>
        <v-row  class="d-flex justify-center">
            <v-col  md="4" sm="4" cols="12" class="d-flex justify-center">
                <addTask @addtask="addtask" />  
            </v-col>
            <v-col  md="4" sm="4" cols="12" class="d-flex justify-center">
                <v-select class="mt-lg-6 mt-sm-6" dense outlined v-model="priority" :items="items" label="Sélectionner une priorité à filtrer" item-text="label" item-value="id"></v-select>
            </v-col>
        </v-row>
     
        <div v-for="task in tasks" :key="task.id">
            <task :task='task'  @updateTask="updateTask" @undoTask="undoTask" @finishTask="finishTask"  @deleteTask="deleteTask" />    
        </div>
    </v-container>
</template>

<script src="./dashboard.js"></script>