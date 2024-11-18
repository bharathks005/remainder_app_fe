import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../../store/toastSlice';
import { Toast } from 'flowbite-react';
import { HiCheck, HiExclamation } from "react-icons/hi";
import classes from './toast.module.scss';

export default function ToastComponent() {
    const dispatch = useDispatch();
    const toasts = useSelector(state => state.toast.toasts);
    return (
        <div className="space-y-2" >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    className={classes.alert}
                    onClose={() => dispatch(removeToast(toast.id))}
                >
                    <div className="flex items-center">
                        {
                            toast.type === 'success' && <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                        }
                        {
                            toast.type === 'error' && <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                <HiExclamation className="h-5 w-5" />
                            </div>
                        }
                        <div className="ml-3 text-sm font-normal"><span className={toast.type === 'error' ? 'text-red-500' : ''}>{toast.message}</span></div>
                        <Toast.Toggle onDismiss={() => dispatch(removeToast(toast.id))} />
                    </div>

                </Toast>
            ))}
        </div>
    );
}
