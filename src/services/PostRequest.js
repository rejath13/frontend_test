import axios from 'axios';


// const API_URL = 'https://mylocatorsoft.com/locator-admin/api/v1';
export const API_URL = 'http://85.195.96.47:3030/locator-admin/api/v1';
// const API_URL = 'http://localhost:3030/locator-admin/api/v1';

const PostRequest = async (path, data = {}, button = false,isFormData = false) => {

    const headers = { 'Content-Type': 'application/json' };


    if(isFormData){
        headers['Content-Type'] = 'multipart/form-data'
    }

    var buttonText = ''
    if (button) {
        var elem = document.getElementById(button);

        if (elem) {
            buttonText = elem.textContent || elem.innerText;;
            elem.innerHTML = `<i class="fa fa-spinner fa-spin"> </i> Loading`;
            elem.disabled = true;
        }

    }

    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}${path}`, data, { headers: headers })
            .then(function (response) {
                try {
                    if (response.data.code !== 200) {
                        throw new Error(response.data.data);
                    }
                    resolve(response.data.data);
                } catch (error) {
                    reject(error.message);
                } finally {
                    if (button) {
                        var elem = document.getElementById(button);
                        if (elem) {
                            elem.innerHTML = buttonText;
                            elem.disabled = false;
                        }
                    }
                }
            })
            .catch(function (error) {
                console.log('Error : ', error)
                reject(error.message);
                if (button) {
                    var elem = document.getElementById(button);
                    if (!elem) return
                    elem.innerHTML = buttonText;
                    elem.disabled = false;
                }
            });
    })

}

export default PostRequest;
