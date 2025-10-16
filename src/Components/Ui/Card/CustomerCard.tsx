/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import TextTheme from '../Text/TextTheme';
import FeatherIcon from '../../Icon/FeatherIcon';
import { useTheme } from '../../../Contexts/ThemeProvider';
import AnimateButton from '../Button/AnimateButton';
import ShowWhen from '../../Other/ShowWhen';
import LoadingView from '../../Layouts/View/LoadingView';
import { formatNumberForUI, getFormattedName, getInitials, sliceString } from '../../../Utils/functionTools';
import BackgroundThemeView from '../../Layouts/View/BackgroundThemeView';
import ScaleAnimationView from '../Animation/ScaleAnimationView';
import { GetUserLedgers } from '../../../Utils/types';


type CustomerCardProps = {
    item: GetUserLedgers,
    onPress?: () => void,
    backgroundColor?: string,
    color?: string
}

export default function CustomerCard({ item, onPress = () => { } }: CustomerCardProps): React.JSX.Element {
    const { ledger_name, parent, phone, total_amount } = item;

    const { primaryBackgroundColor, primaryColor } = useTheme();
    const bgColor = total_amount === 0 ? `${primaryColor}1A` : total_amount > 0 ? 'rgba(200,0,0, .1)' : 'rgba(50,200,150, .1)';
    const avatarColor = total_amount === 0 ? `${primaryColor}4A` : total_amount > 0 ? 'rgba(200,0,0, .4)' : 'rgba(50,200,150, .4)';
    const borderColor = total_amount === 0 ? `${primaryColor}8A` : total_amount > 0 ? 'rgba(200,0,0, .8)' : 'rgba(50,200,150, .8)';

    return (
        <ScaleAnimationView useRandomDelay={true} >
            <AnimateButton
                style={{ padding: 12, borderRadius: 16, backgroundColor: bgColor, borderColor: borderColor, borderWidth: 1 }} bubbleScale={30}
                onPress={onPress}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ borderRadius: 50, aspectRatio: 1, width: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: primaryBackgroundColor, backgroundColor: avatarColor }} >
                            <TextTheme fontSize={14} fontWeight={600}>{getInitials(ledger_name)}</TextTheme>
                        </View>

                        <View>
                            <TextTheme fontSize={16} fontWeight={600}>{getFormattedName(sliceString(ledger_name, 18) ?? '')}</TextTheme>
                            <TextTheme fontSize={12}>{parent}</TextTheme>
                        </View>
                    </View>

                    <View style={{ alignItems: 'flex-end' }} >
                        <ShowWhen when={phone?.number !== '' && ['Debtors', 'Creditors'].includes(parent)} >
                            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }} >
                                <TextTheme isPrimary={false} fontSize={12}>{phone?.code} {phone?.number}</TextTheme>
                                <FeatherIcon isPrimary={false} name="phone" size={12} />
                            </View>
                        </ShowWhen>

                        <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }} >
                            <TextTheme isPrimary={true} fontSize={14} fontWeight={900} color={total_amount === 0 ? `${primaryColor}8A` : total_amount > 0 ? 'rgba(200,0,0, .8)' : 'rgba(50,200,150, .8)'}>
                                {total_amount === 0 ? '' : total_amount > 0 ? ' DR' : ' CR'} {formatNumberForUI(Math.abs(total_amount))} INR
                            </TextTheme>
                        </View>
                    </View>
                </View>
            </AnimateButton>
        </ScaleAnimationView>
    );
}




export function CustomerLoadingView({ isPrimary = false }): React.JSX.Element {
    return (
        <ScaleAnimationView useRandomDelay={true} >
            <BackgroundThemeView isPrimary={isPrimary} style={{ padding: 12, borderRadius: 16, gap: 4 }} >
                <LoadingView height={14} width={150} isPrimary={!isPrimary} />
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }} >
                    <LoadingView height={12} width={80} isPrimary={!isPrimary} />
                    <LoadingView height={12} width={60} isPrimary={!isPrimary} />
                </View>
            </BackgroundThemeView>
        </ScaleAnimationView>
    );
}
