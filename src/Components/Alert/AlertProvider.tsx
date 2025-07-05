import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type AlertType = 'error' | 'success' | 'info' | 'warning' | null;

type AlertMsgType = {
    type: AlertType,
    message?: string,
    id?: string
}

type AlertContextType = {
    alert: AlertMsgType,
    setAlert: Dispatch<SetStateAction<AlertMsgType>>
}

const AlertContext = createContext<AlertContextType>({
    alert: {
        type: null,
        message: '',
        id: ''
    },
    setAlert: () => {}
})


export default function AlertProvider({children}: {children: ReactNode}): React.JSX.Element {

    const [alert, setAlert] = useState<AlertMsgType>({type: null})

    const states: AlertContextType = {
        alert, setAlert
    }

    return <AlertContext.Provider value={states} >
        {children}
    </AlertContext.Provider>
}


export function useAlert(): AlertContextType{
    return useContext(AlertContext);   
}