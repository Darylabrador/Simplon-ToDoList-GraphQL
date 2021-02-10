import { apiService } from '../_services/apiService.js';
import Task from '../components/Task.vue';

export default {
    components: {
        Task
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
                console.log(this.tasks);
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        }
    }
}