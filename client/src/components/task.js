import {apiService} from '../_services/apiService.js';
import DetailTask from '../components/modals/DetailTask.vue';
import DeleteTask from '../components/modals/DeleteTask.vue';

export default {
    components: {
        DetailTask,
        DeleteTask
    },
    props: {
        task: {
            default: function () {
                return {}
            }
        },
    },
    methods:{
        updateTask(taskUpdated){
            this.$emit('updateTask', taskUpdated);
        },
        async undoTask(taskId){
            try {
                const graphqlQuery = {
                    query: `
                    mutation{
                        setTaskStatus(statusTaskInput: {
                            id: ${taskId}
                            done: false
                        })
                        {id title description deadline done priority{id label} user{id pseudo}}
                    }`
                };
                // const undoRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const undoRequest = await apiService.post(`http://localhost:3000/graphql`, graphqlQuery);
                const undoErrors = undoRequest.data.errors;

                if (undoErrors) {
                    this.flashMessage.error({
                        title: undoErrors[0].message,
                        time: 8000,
                    })
                } else {
                    const undoData = undoRequest.data.data.setTaskStatus;
                    this.$emit('undoTask', undoData);
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        },
        async finish(taskId){
            try {
                const graphqlQuery = {
                    query: `
                    mutation{
                        setTaskStatus(statusTaskInput: {
                            id: ${taskId}
                            done: true
                        })
                        {id title description deadline done priority{id label} user{id pseudo}}
                    }`
                };
                // const finishRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const finishRequest = await apiService.post(`http://localhost:3000/graphql`, graphqlQuery);
                const finishErrors = finishRequest.data.errors;

                if (finishErrors) {
                    this.flashMessage.error({
                        title: finishErrors[0].message,
                        time: 8000,
                    })
                } else {
                    const finishData = finishRequest.data.data.setTaskStatus;
                    this.$emit('finishTask', finishData);
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        },
        deleteTask(val){
            this.$emit('deleteTask', val);
        }
    }
}