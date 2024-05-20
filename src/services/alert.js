import React from 'react'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


export const showAlert = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        //title: alert.title,
        icon: alert.type,
        text: alert.text,
        // type: alert.type
    });
};
