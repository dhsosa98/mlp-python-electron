
import Swal from "sweetalert2"

export const infoAlert = async (title: string, text?: string, theme?: string) =>{
    return await Swal.fire({
        title: title,
        text: text,
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: false,
        ...(theme==='dark' && {background: '#1e293b'}),
    })
}

export const successAlert = async (title: string, text?: string, theme?: string) =>{
    console.log(theme)
    return await Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1500,
        ...(theme==='dark' && {background: '#1e293b'}),
    })
}

export const errorAlert = async (title: string, text?: string, theme?: string) =>{
    return await Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        showCancelButton: false,
        showConfirmButton: false,
        ...(theme==='dark' && {background: '#1e293b'}),
    })
}
