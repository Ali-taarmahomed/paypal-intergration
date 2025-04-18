'use client'
import { ToastContainer } from 'react-toastify'

import React from 'react'

export const CustomToast = () => {
    return (
        <ToastContainer
            position='bottom-right'
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    )
}
