import { apiService } from '../../_services/apiService.js';

export default{
    data(){
        return {
            isValid: false,
            dialog: false,
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
            oldPasswordRules: [
                v => !!v || 'Ancien mot de passe requis',
                v => v.length > 5 || '6 caractères minimuns',
            ],
            newPasswordRules: [
                v => !!v || 'Nouveau mot de passe requis',
                v => v.length > 5 || '6 caractères minimuns',
            ],
            newPasswordConfirmRules: [
                v => !!v || 'Confirmation mot de passe requis',
                v => v.length > 5 || '6 caractères minimuns',
            ],
        }
    },
    watch: {
        oldPassword(val){
            if(val != ''){
                this.isValidFields(val,this.newPassword, this.newPasswordConfirm)
            } else {
                this.isValid = false;
            }
        },
        newPassword(val) {
            if(val != ''){
                this.isValidFields(this.oldPassword, val, this.newPasswordConfirm)
            } else {
                this.isValid = false;
            }
        },
        newPasswordConfirm(val) {
            if(val != ''){
                this.isValidFields(this.oldPassword, this.newPassword, val)
            } else {
                this.isValid = false;
            }
        },
    },
    methods: {
        async changePassword() {
            try {
                if(this.isValid){
                    const graphqlQuery = {
                        query: `
                        mutation{
                            updatePassword(
                                oldPassword: "${this.oldPassword}" 
                                password: "${this.newPassword}" 
                                passwordConfirm: "${this.newPasswordConfirm}" 
                            )
                        }`
                    };
                    const updatePwdRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                    
                    if (updatePwdRequest.data.errors) {
                        this.flashMessage.error({
                            title: updatePwdRequest.data.errors[0].message,
                            time: 8000,
                        })
                    } else {
                        const updatePwdData = updatePwdRequest.data.data.updatePassword;
                        if (updatePwdData != null) {
                            this.flashMessage.error({
                                title: updatePwdData,
                                time: 8000,
                            })
                        } else {
                            this.oldPassword = '';
                            this.newPassword = '';
                            this.newPasswordConfirm = '';
                            this.isValid = false;
                            this.dialog = false;
                            this.flashMessage.success({
                                title: "Mise à jour effectuée",
                                time: 8000,
                            })
                        }
                    }
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        }, 
        isValidFields(oldPassword, newPassword, newPasswordConfirm){
            if (oldPassword.length > 5 && newPassword.length > 5 && newPasswordConfirm.length > 5) {
                this.isValid = true;
            } else {
                this.isValid = false;
            }
        }
    }
}