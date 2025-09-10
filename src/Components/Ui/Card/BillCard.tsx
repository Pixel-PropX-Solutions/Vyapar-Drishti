
/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import TextTheme from '../Text/TextTheme';
import { getMounthName } from '../../../Functions/TimeOpration/timeByIndex';
import BackgroundThemeView from '../../Layouts/View/BackgroundThemeView';
import ShowWhen from '../../Other/ShowWhen';
import AnimateButton from '../Button/AnimateButton';
import FeatherIcon from '../../Icon/FeatherIcon';
import { useAppStorage } from '../../../Contexts/AppStorageProvider';
import LoadingView from '../../Layouts/View/LoadingView';
import { formatNumberForUI, sliceString } from '../../../Utils/functionTools';
import ScaleAnimationView from '../Animation/ScaleAnimationView';
import { useMemo } from 'react';

export type BillCardProps = {
    createOn: string,
    type: string,
    payAmount: number,
    totalAmount: number,
    billNo: string,
    customerName: string,
    onPress?: () => void,
    onShare?: () => void,
    onPrint?: () => void,
    onPayment?: () => void,
    isPrimary?: boolean
}


export default function BillCard({ createOn, totalAmount = 0, payAmount = 0, billNo, customerName, type, onPress, onShare, onPrint, onPayment, isPrimary = true }: BillCardProps) {
    const { currency } = useAppStorage();

    const isPending = payAmount < totalAmount;
    const status: 'paid' | 'pending' | 'partial' = totalAmount === payAmount ? 'paid' : payAmount === 0 ? 'pending' : 'partial';

    const rgb = useMemo<string>(() => {
        if (status === 'pending') { return '200,50,50'; }
        if (status === 'partial') { return '200,150,50'; }
        if (['sales', 'receipt'].includes(type.toLowerCase())) { return '50,200,150'; }
        return '50,150,200';
    }, [status, type]);


    const formatDate = (dateString: string) => {
        const parts = dateString.split('-');
        return `${getMounthName(parseInt(parts[1]) - 1)} ${parts[2]}, ${parts[0]}`;
    };

    return (
        <ScaleAnimationView useRandomDelay={true} >
            <BackgroundThemeView isPrimary={isPrimary} style={{ borderRadius: 10, overflow: 'hidden' }} >
                <AnimateButton onPress={() => { if (['sales', 'purchase'].includes(type.toLowerCase())) { onPress && onPress(); } }} >
                    <View style={{ width: 4, height: '100%', backgroundColor: `rgb(${rgb})`, position: 'absolute', left: 0, top: 0 }} />
                    <View style={{ width: '100%', height: '100%', backgroundColor: `rgba(${rgb},0.1)`, position: 'absolute', left: 0, top: 0 }} />

                    <View style={{ padding: 10, gap: 8, paddingLeft: 14 }} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View>
                                <TextTheme isPrimary={isPrimary} fontSize={14} fontWeight={800}>
                                    {sliceString(customerName, (status === 'pending' || type.toLowerCase() === 'sales') ? 20 : 30)}
                                </TextTheme>
                                <TextTheme isPrimary={false} fontSize={12} fontWeight={800}>{type}</TextTheme>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 8 }} >
                                <BackgroundThemeView
                                    isPrimary={!isPrimary}
                                    backgroundColor={`rgb(${rgb})`}
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 8, borderRadius: 40, paddingBlock: 6, paddingRight: 12 }}

                                >
                                    <FeatherIcon color="white" name={status === 'paid' ? 'check-circle' : 'clock'} size={16} />
                                    <TextTheme color="white" fontSize={14} fontWeight={900}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </TextTheme>
                                </BackgroundThemeView>

                                <AnimateButton onPress={onPrint} style={{ borderRadius: 50 }} >
                                    <BackgroundThemeView isPrimary={!isPrimary} style={{ alignItems: 'center', justifyContent: 'center', aspectRatio: 1, width: 32 }}  >
                                        <FeatherIcon name="printer" size={16} />
                                    </BackgroundThemeView>
                                </AnimateButton>

                                <AnimateButton onPress={onShare} style={{ borderRadius: 50 }} >
                                    <BackgroundThemeView isPrimary={!isPrimary} style={{ alignItems: 'center', justifyContent: 'center', aspectRatio: 1, width: 32 }}  >
                                        <FeatherIcon name="share-2" size={16} />
                                    </BackgroundThemeView>
                                </AnimateButton>

                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                            <View>
                                <TextTheme isPrimary={false} fontSize={10}>{billNo}</TextTheme>
                                <TextTheme isPrimary={false} fontSize={12}>{formatDate(createOn)}</TextTheme>
                            </View>

                            <View style={{ alignItems: 'flex-end' }} >
                                <TextTheme isPrimary={false} fontSize={10} fontWeight={500}>Total Amount</TextTheme>
                                <TextTheme fontSize={18} fontWeight={900}>
                                    {formatNumberForUI(Math.abs(totalAmount))} {currency}
                                </TextTheme>
                            </View>
                        </View>

                        <ShowWhen when={false} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                <View>
                                    <TextTheme fontSize={18} fontWeight={900}>
                                        {formatNumberForUI(Math.abs(totalAmount - payAmount))} {currency}
                                    </TextTheme>
                                    <TextTheme isPrimary={false} fontSize={10} fontWeight={500}>Due Amount</TextTheme>
                                </View>

                                <AnimateButton
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingInline: 12, borderRadius: 8, paddingBlock: 6, backgroundColor: 'rgb(50,120,200)' }}
                                    onPress={onPayment}
                                >
                                    <TextTheme color="white" fontSize={14}>
                                        Pay pending amount
                                    </TextTheme>
                                </AnimateButton>
                            </View>
                        </ShowWhen>
                    </View>
                </AnimateButton>
            </BackgroundThemeView>
        </ScaleAnimationView>
    );
}



export function BillLoadingCard({ isPrimary = true, delay }: { isPrimary?: boolean, delay?: number }) {
    return (
        <ScaleAnimationView useRandomDelay={!delay} delay={delay} >
            <BackgroundThemeView isPrimary={isPrimary} style={{ padding: 12, borderRadius: 10, gap: 12 }} >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                    <View style={{ gap: 4 }}>
                        <LoadingView isPrimary={!isPrimary} height={16} width={150} />
                        <LoadingView isPrimary={!isPrimary} height={12} width={100} />
                    </View>

                    <View style={{ gap: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <LoadingView isPrimary={!isPrimary} height={32} width={60} borderRadius={40} />
                        <LoadingView isPrimary={!isPrimary} height={32} width={32} borderRadius={40} />
                        <LoadingView isPrimary={!isPrimary} height={32} width={32} borderRadius={40} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                    <View style={{ gap: 4 }}>
                        <LoadingView isPrimary={!isPrimary} height={10} width={60} />
                        <LoadingView isPrimary={!isPrimary} height={10} width={80} />
                    </View>

                    <View style={{ gap: 4, alignItems: 'flex-end' }}>
                        <LoadingView isPrimary={!isPrimary} height={10} width={60} />
                        <LoadingView isPrimary={!isPrimary} height={16} width={100} />
                    </View>
                </View>
            </BackgroundThemeView>
        </ScaleAnimationView>
    );
}
