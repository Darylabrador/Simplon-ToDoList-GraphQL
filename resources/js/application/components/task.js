import DetailTask from '../components/modals/DetailTask.vue';

export default {
    components: {
        DetailTask
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
        }
    }
}