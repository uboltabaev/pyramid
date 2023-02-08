import axios from 'axios';
import _ from 'underscore';
import CONFIG from '../config/config'

class MailGun {
    static send(params, callback) {
        const data = {
            personalizations: [
                {'to': [{'email': params.to}]}
            ],
            from: {'email': params.from},
            subject: params.subject,
            content: [
                {'type': 'text/plain', 'value': params.text}
            ]
        };
        _.has(params, 'attachments') && (data.attachments = params.attachments);
        axios({
            method: 'post',
            url: CONFIG.SENDGRID.URL,
            data: JSON.stringify(data),
            headers: {
                'Authorization': 'Bearer ' + CONFIG.SENDGRID.API_KEY,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            let status = response.status === 202 ? true : false;
            if (_.isFunction(callback))
                callback(status);
        }).catch((error) => {
            if (_.isFunction(callback))
                callback(false);
        });
    }
}

export default MailGun;