
import Swal from "sweetalert2"

export const infoAlert = async (title: string, text?: string) =>{
    return await Swal.fire({
        title: title,
        text: text,
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: false,
    })
}

export const successAlert = async (title: string, text?: string) =>{
    return await Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1500,
    })
}