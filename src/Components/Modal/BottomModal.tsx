/* eslint-disable react-native/no-inline-styles */

import { Keyboard, Modal, ModalProps, PressableProps, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import FeatherIcons from 'react-native-vector-icons/Feather';
import { Text } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeProvider";
import AlertCard from "../Ui/Alert/AlertCard";
import { Dimensions } from "react-native";
import { ReactNode, useEffect, useState } from "react";
import AnimateButton from "../Ui/Button/AnimateButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ShowWhen from "../Other/ShowWhen";

type ActionButton = {
    key?: string,
    title: string,
    onPress: (arg: PressableProps) => void,
    color?: string,
    backgroundColor?: string,
    icon?: any,
    style?: ViewStyle
};

export { type ActionButton as BottomModalActionButton }

type BottomModalProps = ModalProps & {
    visible: boolean,
    setVisible: (vis: boolean) => void,
    children: React.ReactNode,
    actionButtons?: ActionButton[],
    actionContainerContent?: ReactNode
    transparent?: boolean,
    style?: ViewStyle,
    bottomOpationStyle?: ViewStyle,
    backdropColor?: string,
    closeOnBack?: boolean,
    animationType?: "none" | "slide" | "fade",
    onClose?: () => void,
    alertId?: string,
    topMarginPrecentage?: number,
    topMargin?: number
}

export default function BottomModal({ visible, setVisible, children, style, backdropColor = 'rgba(0, 0, 0, 0.50)', actionButtons, closeOnBack = true, animationType = 'slide', bottomOpationStyle = {}, onClose = () => { }, alertId, topMarginPrecentage = 0.01, topMargin = 40, actionContainerContent, ...props }: BottomModalProps): React.JSX.Element {

    const { primaryColor, primaryBackgroundColor } = useTheme();

    const { height } = Dimensions.get('window');
    const { top, bottom } = useSafeAreaInsets();

    const [maxHeight, setMaxHeight] = useState<number>(height - top - bottom - 32 - (height * topMarginPrecentage) - topMargin)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ({ endCoordinates }) => {
            setMaxHeight((pre) => pre - endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ({ endCoordinates }) => {
            setMaxHeight(height - top - bottom - 32 - (height * topMarginPrecentage) - topMargin);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);


    return (
        <Modal {...props} backdropColor={backdropColor} animationType={animationType} visible={visible} onRequestClose={() => { setVisible(!closeOnBack); onClose(); }}>
            {alertId && <AlertCard id={alertId} />}
            <View style={[styles.root]}>
                <AnimateButton onPress={() => { setVisible(false); onClose(); }} style={{ width: '100%', flex: 1 }} />

                <View style={[styles.modalContener, { backgroundColor: primaryBackgroundColor, borderColor: primaryColor, maxHeight }, style]}>
                    {children}
                </View>


                <View style={[styles.bottomOpations, { backgroundColor: primaryBackgroundColor, borderColor: primaryColor, borderWidth: 2, }, bottomOpationStyle]}>
                    <AnimateButton style={{ borderColor: primaryColor, backgroundColor: primaryBackgroundColor, ...styles.closeBtn }} onPress={() => { setVisible(false); onClose(); }}>
                        <FeatherIcons name="plus" size={16} color={primaryColor} style={{ transform: 'rotate(45deg)' }} />
                    </AnimateButton>

                    <View style={styles.actionsButtonsBox}>
                        <ShowWhen when={!actionContainerContent} otherwise={actionContainerContent} >
                            {
                                actionButtons?.map(({ title, onPress, icon, backgroundColor, color, style, key }, index) => (
                                    <AnimateButton bubbleColor={color ?? primaryColor} key={`${key + title + index}`} onPress={onPress}
                                    style={{ height: 44, borderRadius: 100, paddingInline: 20, display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 10, borderColor: color || primaryColor, backgroundColor: backgroundColor || primaryBackgroundColor, borderWidth: 2, overflow: 'hidden', ...style }}
                                    >
                                        {icon ? icon : null}

                                        {title && <Text style={{ color: color || primaryColor, fontWeight: '900', fontSize: 14 }}>{title}</Text>}
                                    </AnimateButton>
                                ))
                            }
                        </ShowWhen>
                    </View>
                </View>
            </View>
        </Modal>
    );
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
        paddingInline: 2,
    },

    modalContener: {
        width: '100%',
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        paddingTop: 20,
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
        paddingInline: 20,
    },

    closeBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 2,
        position: 'relative',
        top: -18,
    },

    actionsButtonsBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 14,
        transform: 'translateY(-25%)',
        position: 'relative',
    },
});
