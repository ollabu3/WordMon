import axios from 'axios';

export const ADD_CUSTOMER = 'ADD_CUSTOMER';

export function addCustomer(file) {
  return () => {
    const url = 'http://localhost:4000/user/profile';
    const formData = new FormData();
    formData.append('image', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    return axios.post(url, formData, config).then((response) => {
      console.log(response.data);
    });
  };
}
