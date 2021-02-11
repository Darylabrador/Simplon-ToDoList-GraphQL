import { apiService } from '../_services/apiService.js';
import Task from '../components/Task.vue';
import AddTask from '../components/modals/AddTask.vue';

export default {
    components: {
        Task,
        AddTask
    },

    data() {
        return {
            tasks: []
        }
    },

    created() {
        this.getTask();
    },

    methods: {
        async getTask() {
            try {
                const graphqlQuery = {
                    query: `
                    { 
                        tasks { 
                            id 
                            title 
                            description 
                            done 
                            deadline
                            priority {
                                id 
                                label
                            } 
                            user {
                                id 
                                pseudo
                            }
                        }
                    }`,
                };
                const taskRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const taskData    =  taskRequest.data.data.tasks;
                this.tasks = taskData;
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        },
        addtask(val){
            this.getTask();
        },
        updateTask(val){
            console.log(val)
            this.getTask();
        }
    }
}