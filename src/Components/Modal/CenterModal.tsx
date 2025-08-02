import { Dispatch, ReactNode, SetStateAction } from "react"
import { Modal, View } from "react-native"
import ScaleAnimationView from "../Ui/Animation/ScaleAnimationView"
import NormalButton from "../Ui/Button/NormalButton"
import BackgroundThemeView from "../Layouts/View/BackgroundThemeView"
import ShowWhen from "../Other/ShowWhen"
import AnimateButton from "../Ui/Button/AnimateButton"

type Props = {
    visible: boolean,
    children: ReactNode
    setVisible: Dispatch<SetStateAction<boolean>>,
    closeOnBack?: boolean,
    hasCloseButton?: boolean,
    isPrimary?: boolean,
    useInvertTheme?: boolean,
    actionButtons?: {title: string, icon?: ReactNode, onPress: () => void, backgroundColor?: string, isPrimary?: boolean}[]
}

export default function CenterModal({visible, children, setVisible, isPrimary, useInvertTheme, actionButtons, closeOnBack=true, hasCloseButton=true}: Props) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            backdropColor={'rgba(0,0,0,0.5)'}
            onRequestClose={() => setVisible(!closeOnBack)}
        >
            <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} >
                <AnimateButton style={{width: '100%', flex: 1}} onPress={() => setVisible(!closeOnBack)} bubbleColor="rgba(255,255,2550.5)" />

                <ScaleAnimationView style={{paddingHorizontal: 20}} >
                    <BackgroundThemeView 
                        isPrimary={isPrimary} 
                        useInvertTheme={useInvertTheme} 
                        style={{alignItems: 'center', justifyContent: 'flex-end', padding: 8, borderRadius: 12}} 
                    >
                        {children}

                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 12}} >  
                            {actionButtons?.map(item => (
                                <NormalButton
                                    key={item.title}
                                    text={item.title}
                                    onPress={item.onPress}
                                    backgroundColor={item.backgroundColor}
                                    icon={item.icon}
                                    isPrimary={item.isPrimary}
                                />
                            ))}

                            <ShowWhen when={!!hasCloseButton} >
                                <NormalButton
                                    text={'Close'}
                                    isPrimary={false}
                                    onPress={() => {setVisible(false)}}
                                />
                            </ShowWhen>
                        </View>
                    </BackgroundThemeView>
                </ScaleAnimationView>

                <AnimateButton style={{width: '100%', flex: 1}} onPress={() => setVisible(!closeOnBack)} bubbleColor="rgba(255,255,2550.5)"  />
            </View>
        </Modal>
    )
}