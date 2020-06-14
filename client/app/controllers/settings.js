import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ENV from "client/config/environment";

export default Controller.extend({
    session: service(),
    ajax: service(),
    toastr: service('toast'),

    actions: {
        async save() {
            try {
                if(this.username || this.password) {
                    const res = await this.ajax.request(`${ENV.host}/credentials`, {
                        method: 'POST',
                        data: {
                            username: this.username,
                            password: this.password
                        }
                    });

                    if(res.success) {
                        this.toastr.success("Saved changes", "Done");
                    }
                } else {
                    this.toastr.error("Please fill either password or username", "Error");
                }
            } catch (error) {
                this.toastr.error("Something went wrong", "Error");
                throw error;
            }
        }
    }
});