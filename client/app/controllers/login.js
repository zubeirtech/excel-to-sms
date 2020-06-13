import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default Controller.extend({
    session: service(),
    toastr: service('toast'),

    actions: {

        login(){
            set(this, "auth", true);
            this.toastr.info('Server (heroku) is starting up, this might take few seconds', 'Important Info');
            if(this.password && this.username) {
                this.session.authenticate('authenticator:oauth2', this.username, this.password).then(() => {
                }).catch(reason => {
                    set(this, 'errorMessage', reason.error || reason);
                    this.toastr.error('Password or username is wrong', 'Error');
                })
            } else {
                set(this, "auth", false);
                this.toastr.error('Please fill out all fields', 'Error');
            }
        }
    }
});
