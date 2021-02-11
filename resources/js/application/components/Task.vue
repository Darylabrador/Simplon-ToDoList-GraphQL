<template>
    <v-card class="mx-auto my-2" width="75%" :class="task.done ? 'green lighten-4' : '' ">
        <v-card-actions>
            <v-list-item class="grow">
                <v-list-item-content>
                    <v-list-item-title>
                        <detailTask :taskInfo="task" @updateTask="updateTask" />
                        {{ task.title }} 
                    </v-list-item-title>
                </v-list-item-content>
                <v-row align="center" justify="end">
                        <v-btn icon color="dark" v-if="task.done">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                        <v-btn icon color="dark" v-if="task.done">
                        <v-icon>mdi-close-circle-outline</v-icon>
                    </v-btn>
                        <v-btn icon color="dark" v-if="!task.done">
                        <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                    </v-btn>
                        <v-btn icon color="dark">
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </v-row>
            </v-list-item>
        </v-card-actions>
    </v-card>
</template>

<script src='./task.js'></script>