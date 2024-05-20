
import axios from 'axios';

export const BASE_URL = '';
// const API_URL = 'https://api.openrouteservice.org';
// https://optimization.mylocatorsoft.com:8443
export const OPTIMIZER_API_URL = `https://beta.mylocatorplus.com/optimization-plannner/api`;

const  OptimizationRequest = async (path, data = {}) => {

    const headers = { 'Content-Type': 'application/json' };

    return new Promise((resolve, reject) => {
        axios.post(`${OPTIMIZER_API_URL}${path}`, data, { headers: headers })
            .then(function (response) {
                try {
                    resolve(response.data);
                } catch (error) {
                    reject(error.message);
                }
            })
            .catch(function (error) {
                console.log('Error : ', error)
                reject(error.message);
            });
    })
}

export default OptimizationRequest;