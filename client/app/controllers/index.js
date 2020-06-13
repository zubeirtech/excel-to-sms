import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from "ember-concurrency";
import { set, get } from '@ember/object';
import ENV from "client/config/environment";

export default Controller.extend({
    toast: service(),
    session: service(),
    router: service(),
    ajax: service(),

    sendToServer: task(function* (image) {
        set(this, "loader", true);
            
        set(image, "name", image.id + "." + image.extension);
    
        try {
          yield image.upload(`${ENV.host}/upload`);
          set(this, "image", "");
          set(this, "loader", false);
        } catch (e) {
          this.toast.error("Something went wrong", "Error");
          set(this, "loader", false);
          console.error(e);
        }
      })
        .maxConcurrency(3)
        .enqueue(),

    actions: {
        uploadExcel(image) {            
            set(this, "image", image)
        },

        send() {
            try {
                set(this, "loader", true);
                if(this.image) {
                  get(this, 'sendToServer').perform(this.image);
                } else {
                  this.toast.error("Please make sure a document and the title is ready", "Error");
                  set(this, "loader", false);
                }
            } catch (error) {
                set(this, "loader", false);
                console.error(error)
            }
        }
    }
});