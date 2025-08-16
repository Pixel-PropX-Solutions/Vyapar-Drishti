import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type AlertType = 'error' | 'success' | 'info' | 'warning' | null;

type AlertMsgType = {
    type: AlertType,
    message?: string,
    id?: string,
    duration?: number
}

type AlertContextType = {
    alert: AlertMsgType,
    setAlert: Dispatch<SetStateAction<AlertMsgType>>
}

const AlertContext = createContext<AlertContextType>({
    alert: {
        type: null,
        message: '',
        id: '',
        duration: 5000,
    },
    setAlert: () => { },
});


export default function AlertProvider({ children }: { children: ReactNode }): React.JSX.Element {

    const [alert, setAlert] = useState<AlertMsgType>({ type: null });

    const states: AlertContextType = {
        alert, setAlert,
    };

    return <AlertContext.Provider value={states} >
        {children}
    </AlertContext.Provider>;
}


export function useAlert(): AlertContextType {
    return useContext(AlertContext);
}
