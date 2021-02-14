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
            tasks: [],
            items: [],
            priority: '',
        }
    },

    watch: {
        priority(val) {
            switch (val) {
                case "1":
                    this.filtertask(val)
                    break;
                case "2":
                    this.filtertask(val)
                    break;
                case "3":
                    this.filtertask(val)
                    break;
                default:
                    this.getTask()
                    break;
            }
        }
    },

    created() {
        this.getTask();
        this.setSelectPriority();
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
                if(taskRequest.data.errors){
                    this.flashMessage.error({
                        title: taskRequest.data.errors[0].message,
                        time: 8000,
                    })

                    if (taskRequest.data.errors[0].extensions.category == "authentication"){
                        localStorage.clear();
                        this.$emit('unathorized', false);
                        return this.$router.push('/connexion');
                    }
                } else {
                    const taskData  =  taskRequest.data.data.tasks;
                    this.tasks      = taskData;
                }
            } catch (error) {
                // console.log(error)
                // this.flashMessage.error({
                //     title: "Ressource indisponible",
                //     time: 8000,
                // })
            }
        },
        async setSelectPriority() {
            try {
                const graphqlQuery = {
                    query: `{priorities{id label}} `
                };
                const selectRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                
                if (selectRequest.data.errors) {
                    this.flashMessage.error({
                        title: selectRequest.data.errors[0].message,
                        time: 8000,
                    })
                } else {
                    const selectData = selectRequest.data.data.priorities;
                    selectData.unshift({ id: "", label: "Tous" })
                    this.items = selectData;
                } 
            } catch (error) {
                // this.flashMessage.error({
                //     title: "Ressource indisponible",
                //     time: 8000,
                // })
            }
        },
        addtask(val){
            this.refreshFront();
        },
        updateTask(val){
            this.refreshFront();
        },
        undoTask(val){
            this.refreshFront();
        },
        finishTask(val){
            this.refreshFront();
        },
        deleteTask(val) {
            this.refreshFront();
        },
        async filtertask(priorityId){
            try {
                const graphqlQuery = {
                    query: `
                    {
                        tasks(where: { column: PRIORITY_ID, operator: EQ, value: ${priorityId} }) {
                            id title description done deadline priority{id label} user{id pseudo}
                        }
                    }`
                };
                const filterRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                if (filterRequest.data.errors) {
                    this.flashMessage.error({
                        title: filterRequest.data.errors[0].message,
                        time: 8000,
                    })
                } else {
                    const filterData = filterRequest.data.data.tasks;
                    this.tasks = filterData;
                } 
            } catch (error) {
                // this.flashMessage.error({
                //     title: "Ressource indisponible",
                //     time: 8000,
                // })
            }
        },
        refreshFront() {
            switch (this.priority) {
                case "1":
                    this.filtertask(this.priority)
                    break;
                case "2":
                    this.filtertask(this.priority)
                    break;
                case "3":
                    this.filtertask(this.priority)
                    break;
                default:
                    this.getTask()
                    break;
            }
        },
        isLogged(){
            
        }
    }
}