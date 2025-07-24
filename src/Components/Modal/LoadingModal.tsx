/* eslint-disable react-native/no-inline-styles */
import { Modal, ModalProps, View } from "react-native";
import TextTheme from "../Ui/Text/TextTheme";
import BackgroundThemeView from "../Layouts/View/BackgroundThemeView";
import AnimateSpinner from "../Layouts/View/AnimateSpiner";
import ShowWhen from "../Other/ShowWhen";

type Props = ModalProps & {
    visible: boolean;
    text?: string;
    children?: React.ReactNode;
    spinerSize?: number;
    spinerBorderWidth?: number;
}

export default function LoadingModal({ visible, text = '', children, spinerBorderWidth = 8, spinerSize = 60, ...props }: Props): React.JSX.Element {

    return (
        <Modal {...props} visible={visible} transparent={false} animationType="fade" backdropColor={'rgba(0, 0, 0, 0.50)'} >
            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} >
                <BackgroundThemeView isPrimary={true} style={{ padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 12 }}  >
                    <AnimateSpinner size={spinerSize} borderWidth={spinerBorderWidth} />
                    <ShowWhen when={text !== ''} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}>
                            {text}
                        </TextTheme>
                    </ShowWhen>
                    {children}
                </BackgroundThemeView>
            </View>
        </Modal>
    )
}