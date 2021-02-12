import { apiService } from '../../_services/apiService.js';

export default{
    props: {
        taskId: {
            default: function () {
                return {}
            }
        },
        taskTitle: {
            default: function () {
                return {}
            }
        },
    },
    data() {
        return {
            dialog: false
        }
    },
    methods: {
        async deleteTask() {
            try {
                const graphqlQuery = {
                    query: `
                    mutation{
                        deleteTask( id: ${this.taskId} )
                        {id title description deadline done priority{id label} user{id pseudo}}
                    }`
                };
                const deleteRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const deleteData = deleteRequest.data.data.setTaskStatus;
                this.$emit('deleteTask', deleteData);
                this.dialog = false;
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        }
    }
}