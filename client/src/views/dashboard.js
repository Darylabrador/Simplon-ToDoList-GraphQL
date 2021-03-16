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
                    query{
                        tasks{
                            id
                            title
                            description
                            done
                            deadline
                            priority{
                                id
                                label
                            }
                            user{
                                id
                                pseudo
                            }
                        }
                    }`,
                };
                
                // const taskRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const taskRequest = await apiService.post(`http://localhost:3000/graphql`, graphqlQuery);
                const taskErrors = taskRequest.data.errors;
     
                if (taskErrors) {
                    if (taskErrors[0].status == 401) {
                        localStorage.clear();
                        this.$emit('unathorized', false);
                        return this.$router.push('/connexion');
                    } 
                } else {
                    const taskData = taskRequest.data.data.tasks;
                    this.tasks = taskData;
                }
            } catch (error) {
                localStorage.clear();
                this.$emit('unathorized', false);
                return this.$router.push('/connexion');
            }
        },
        async setSelectPriority() {
            try {
                const graphqlQuery = {
                    query: `
                    query{
                        priorities{id label}
                    }`
                };

                // const selectRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const selectRequest = await apiService.post(`http://localhost:3000/graphql`, graphqlQuery);
                const selectErrors = selectRequest.data.errors;

                if (selectErrors) {
                    this.flashMessage.error({
                        title: selectErrors[0].message,
                        time: 8000,
                    })
                } else {
                    const selectData = selectRequest.data.data.priorities;
                    selectData.unshift({ id: "", label: "Tous" })
                    this.items = selectData;
                }
            } catch (error) {
                // console.log(error)
            }
        },
        addtask(){
            this.refreshFront();
        },
        updateTask(){
            this.refreshFront();
        },
        undoTask(){
            this.refreshFront();
        },
        finishTask(){
            this.refreshFront();
        },
        deleteTask() {
            this.refreshFront();
        },
        async filtertask(priorityId){
            try {
                const graphqlQuery = {
                    query: `
                    query{
                        filterTask( priorityId: ${priorityId} ) {
                            id title description done deadline priority{id label} user{id pseudo}
                        }
                    }`
                };
                // const filterRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const filterRequest = await apiService.post(`http://localhost:3000/graphql`, graphqlQuery);
                const filterErrors = filterRequest.data.errors;

                if (filterErrors) {
                    this.flashMessage.error({
                        title: filterErrors[0].message,
                        time: 8000,
                    })
                } else {
                    const filterData = filterRequest.data.data.filterTask;
                    this.tasks = filterData;
                }
            } catch (error) {
                // console.log(error)
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
    }
}