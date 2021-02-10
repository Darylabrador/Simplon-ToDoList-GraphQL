<template>
    <v-container>
        <div v-for="task in tasks" :key="task.id">
            <task :task='task' />    
        </div>
    </v-container>
</template>

<script src="./dashboard.js"></script>