import { apiService } from '../../_services/apiService.js';

export default{
    props: {
        taskInfo: {
            default: function () {
                return {}
            }
        },
    },
    data() {
        return {
            isUpdate: false,
            dialog: false,
            menu2: false,
            id: this.taskInfo.id,
            date: this.taskInfo.deadline,
            priority: this.taskInfo.priority.id,
            title: this.taskInfo.title,
            description: this.taskInfo.description,
            items: [this.taskInfo.priority],
            titleRules: [
                v => !!v || 'Le titre est requis',
            ],
            priorityRules: [
                v => !!v || 'Veuillez choisir la priorité',
            ],
            descriptionRules: [
                v => !!v || 'La description est requise',
            ],
        }
    },
    watch:{
        isUpdate(val) {
            if(val) {
                this.setSelectPriority();
            } else {
                this.priority = this.taskInfo.priority.id;
                this.items    = [this.taskInfo.priority];
            }
        }
    },
    methods: {
        closeModal(){
            this.dialog   = false;
            this.isUpdate = false;
        },
        async setSelectPriority() {
            try {
                const graphqlQuery = {
                    query: `query{priorities{id label}} `
                };
                const selectRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const selectErrors = selectRequest.data.errors;

                if (selectErrors) {
                    this.flashMessage.error({
                        title: selectErrors[0].message,
                        time: 8000,
                    })
                } else {
                    const selectData = selectRequest.data.data.priorities;
                    this.items = selectData;
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        },
        async updateTask() {
            try {
                const graphqlQuery = {
                    query: `
                    mutation updateTask($id: ID!, $title: String!, $description: String!, $deadline: Date!, $priorityId: Int!){
                        updateTask(updateTaskInput: {
                            id: $id
                            title: $title
                            description: $description
                            deadline: $deadline
                            priorityId: $priorityId
                        })  
                        {id title description done deadline priority{id label} user{id pseudo}}
                    }`,
                    variables: {
                        id: this.id,
                        title: this.title,
                        description: this.description,
                        deadline: this.date,
                        priorityId: Number(this.priority),
                    }
                };
                const updateRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const updateTaskError = updateRequest.data.errors;

                if (updateTaskError) {
                    this.flashMessage.error({
                        title: updateTaskError[0].message,
                        time: 8000,
                    })
                } else {
                    const updateData = updateRequest.data.data.updateTask;
                    this.$emit('updateTask', updateData);
                    this.closeModal();
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        },
    }
}