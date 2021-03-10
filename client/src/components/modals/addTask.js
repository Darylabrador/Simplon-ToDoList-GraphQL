import {apiService} from '../../_services/apiService.js';

export default{
    data() {
        return {
            isValid: false,
            date: new Date().toISOString().substr(0, 10),
            dialog: false,
            menu2: false,
            priority: '',
            title: '',
            description: '',
            items: [],
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
    watch: {
        title(val) {
            this.isEmpty(val, this.description, this.date, this.priority);
        },
        description(val) {
            if(val == null) {
                this.isValid = false;
            } else {
                this.isEmpty(this.title, val, this.date, this.priority);
            }
        },
        date(val) {
            this.isEmpty(this.title, this.description, val, this.priority);
        },
        priority(val) {
            this.isEmpty(this.title, this.description, this.date, val);
        }
    },
    created(){
        this.setSelectPriority();
    },
    methods: {
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
                    this.items = selectData;
                } 
               
            } catch (error) {
                // this.flashMessage.error({
                //     title: "Ressource indisponible",
                //     time: 8000,
                // })
            }
        },
        async addTask() {
            try {
                if(this.isValid){
                    const graphqlQuery = {
                        query: `
                        mutation{
                            createTask(
                                title: "${this.title}" 
                                description: "${this.description}" 
                                deadline: "${this.date}" 
                                priority_id: ${this.priority}
                            )
                            {id title description deadline done priority{id label} user{id pseudo}}
                        }`
                    };
                    const addTaskRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                    if (addTaskRequest.data.errors) {
                        this.flashMessage.error({
                            title: addTaskRequest.data.errors[0].message,
                            time: 8000,
                        })
                    } else {
                        const addTaskData = addTaskRequest.data.data.createTask;
                        this.isValid = false;
                        this.dialog = false;
                        this.flashMessage.success({
                            title: "Tâche ajouter avec succès",
                            time: 8000,
                        });
                        this.$emit('addtask', addTaskData);
                    } 
                }
            } catch (error) {
                // this.flashMessage.error({
                //     title: "Ressource indisponible",
                //     time: 8000,
                // })
            }
        },
        isEmpty(title, description, date, priority){
            if (title != '' && description != '' && date != '' && priority != '') {
                this.isValid = true;
            } else {
                this.isValid = false;
            }
        }
    }
}