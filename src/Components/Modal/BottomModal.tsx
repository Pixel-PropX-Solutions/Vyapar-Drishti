
import { Keyboard, Modal,  ModalProps,  PressableProps, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import FeatherIcons from 'react-native-vector-icons/Feather';
import { Text } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeProvider";
import AlertCard from "../Alert/AlertCard";
import { Dimensions } from "react-native";
import { useEffect, useState } from "react";
import AnimateButton from "../Button/AnimateButton";

type BottomModalProps = ModalProps & {
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
    alertId?: string,
    topMarginPrecentage?: number,
}

export default function BottomModal({visible, setVisible, children, style, backdropColor='rgba(0, 0, 0, 0.50)', actionButtons, closeOnBack=true, animationType='slide', bottomOpationStyle={}, onClose=()=>{}, alertId, topMarginPrecentage=0.25, ...props}: BottomModalProps): React.JSX.Element {

    const {primaryColor: color, primaryBackgroundColor: backgroundColor, secondaryBackgroundColor} = useTheme();

    const {height} = Dimensions.get('screen');

    const [maxHeight, setMaxHeight] = useState<number>(height - height*topMarginPrecentage)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ({endCoordinates}) => {
            setMaxHeight((pre) => pre - endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setMaxHeight(height - height*topMarginPrecentage);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    

    return (
        <Modal {...props} backdropColor={backdropColor} animationType={animationType} visible={visible} onRequestClose={() => {setVisible(!closeOnBack); onClose();}}>
            {alertId && <AlertCard id={alertId} />}
            <View style={[styles.root]}>
                <AnimateButton onPress={() => setVisible(false)} style={{width: '100%', flex: 1}} />

                <View style={[styles.modalContener, {backgroundColor, borderColor: secondaryBackgroundColor, maxHeight} ,style]}>
                    {children}
                </View>

                
                <View style={[styles.bottomOpations, {backgroundColor, borderColor: secondaryBackgroundColor}, bottomOpationStyle]}>
                    <AnimateButton style={{borderColor: secondaryBackgroundColor, backgroundColor, ...styles.closeBtn}} onPress={() => {setVisible(false); onClose();}}>
                        <FeatherIcons name="plus" size={16} color={color} style={{transform: 'rotate(45deg)'}} />
                    </AnimateButton>
                    
                    <View style={styles.actionsButtonsBox}>
                        {
                            actionButtons?.map(({title, onPress, color='white', backgroundColor='black', icon, style}) => (
                                <AnimateButton bubbleColor={color} key={title} onPress={onPress}
                                    style={{height: 44, borderRadius: 100, paddingInline: 20, display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 10, backgroundColor, overflow: 'hidden', ...style}}
                                >
                                        {icon ? icon : null}
                                        <Text style={{color, fontWeight: '900', fontSize: 14}}>{title}</Text>
                                </AnimateButton>
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