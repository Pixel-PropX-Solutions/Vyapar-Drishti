
import { Modal,  PressableProps, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import FeatherIcons from 'react-native-vector-icons/Feather';
import { Text } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeProvider";
import AlertCard from "../Alert/AlertCard";

type BottomModalProps = {
    visible: boolean,
    setVisible: (vis: boolean) => void,
    children: React.ReactNode,
    actionButtons?: [{title: string, onPress: (arg: PressableProps) => void, color?: string, backgroundColor?: string, icon?: any, style?: ViewStyle}],
    transparent?: boolean,
    style?: ViewStyle,
    bottomOpationStyle?: ViewStyle,
    backdropColor?: string,
    closeOnBack?: boolean,
    animationType?: "none" | "slide" | "fade",
    onClose?: () => void,
    alertId?: string
}

export default function BottomModal({visible, setVisible, children, style, backdropColor='rgba(0, 0, 0, 0.50)', actionButtons, closeOnBack=true, animationType='slide', bottomOpationStyle={}, onClose=()=>{}, alertId}: BottomModalProps): React.JSX.Element {

    const {primaryColor: color, primaryBackgroundColor: backgroundColor, secondaryBackgroundColor} = useTheme()

    return (
        <Modal backdropColor={backdropColor} animationType={animationType} visible={visible} onRequestClose={() => {setVisible(!closeOnBack); onClose();}}>
            {alertId && <AlertCard id={alertId} />}
            <View style={[styles.root]}>
                <TouchableWithoutFeedback onPress={() => setVisible(false)} >
                    <View style={{width: '100%', flex: 1}}></View>
                </TouchableWithoutFeedback>

                <View style={[styles.modalContener, {backgroundColor, borderColor: secondaryBackgroundColor} ,style]}>{children}</View>

                <View style={[styles.bottomOpations, {backgroundColor, borderColor: secondaryBackgroundColor}, bottomOpationStyle]}>
                    <TouchableOpacity style={[styles.closeBtn, {borderColor: secondaryBackgroundColor, backgroundColor}]} onPress={() => {setVisible(false); onClose();}}>
                        <FeatherIcons name="plus" size={16} color={color} style={{transform: 'rotate(45deg)'}} />
                    </TouchableOpacity>
                    
                    <View style={styles.actionsButtonsBox}>
                        {
                            actionButtons?.map(({title, onPress, color='white', backgroundColor='black', icon, style}) => (
                                <TouchableOpacity key={title} onPress={onPress}>
                                    <View 
                                        style={[{height: 44, borderRadius: 100, paddingInline: 20, display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 10, backgroundColor, overflow: 'hidden'}, style]}
                                    >
                                        {icon ? icon : null}
                                        <Text style={{color, fontWeight: '900', fontSize: 14}}>{title}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            </View> 
        </Modal>
    )
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        width: '100%',   
        height: '100%',
        flex: 1,
        paddingInline: 2
    },

    modalContener: {
        width: '100%',
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        paddingTop: 20
    },

    bottomOpations: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderWidth: 1,
        borderBottomWidth: 0,
        height: 32,
        width: '100%',
        paddingInline: 20
    },

    closeBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 1,
        position: 'relative',
        top: -18
    },

    actionsButtonsBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 14,
        transform: 'translateY(-25%)',
        position: 'relative',
    }
})  