/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { View, TouchableOpacity, Pressable } from 'react-native';
import TextTheme from '../Text/TextTheme';
import { getMounthName } from '../../Functions/TimeOpration/timeByIndex';
import BackgroundThemeView from '../View/BackgroundThemeView';
import { Text } from 'react-native';
import ShowWhen from '../Other/ShowWhen';
import AnimatePingBall from '../View/AnimatePingBall';
import AnimateButton from '../Button/AnimateButton';
import FeatherIcon from '../Icon/FeatherIcon';
import numberToString from '../../Functions/Numbers/numberToString';
import { useAppStorage } from '../../Contexts/AppStorageProvider';
import MaterialDesignIcon from '../Icon/MaterialDesignIcon';

export type BillCardProps = {
    createOn: string,
    type: string,
    payAmount: number,
    totalAmount: number,
    pendingAmount: number,
    billNo: string,
    customerName: string,
    onPress?: () => void,
    onPrint?: () => void,
    onPayment?: () => void,
}

export default function BillCard({
    createOn,
    totalAmount = 0,
    payAmount = 0,
    billNo,
    customerName,
    pendingAmount = 0,
    type,
    onPress,
    onPrint,
    onPayment,
}: BillCardProps): React.JSX.Element {

    const { currency } = useAppStorage();

    const status: 'paid' | 'pending' | 'overdue' =
        totalAmount === payAmount ? 'paid' :
            pendingAmount > 0 ? 'pending' : 'overdue';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return { bg: 'rgb(16, 185, 129)', text: 'white' };
            case 'pending': return { bg: 'rgb(245, 158, 11)', text: 'white' };
            case 'overdue': return { bg: 'rgb(239, 68, 68)', text: 'white' };
            default: return { bg: 'rgb(156, 163, 175)', text: 'white' };
        }
    };

    const statusColors = getStatusColor(status);
    const completionPercentage = totalAmount > 0 ? (payAmount / totalAmount) * 100 : 0;

    const formatDate = (dateString: string) => {
        const parts = dateString.split('-');
        return `${getMounthName(parseInt(parts[1])-1)} ${parts[2]}, ${parts[0]}`;
    };

    const formatAmount = (amount: number) => {
        const isNegative = amount < 0;
        const absAmount = Math.abs(amount);
        return {
            value: numberToString(absAmount),
            isNegative,
            color: isNegative ? 'rgb(239, 68, 68)' : 'rgb(16, 185, 129)',
        };
    };

    const CardContent = () => (
        <View style={{ gap: 8 }}>
            {/* Header Section */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 4,
            }}>
                <View style={{ flex: 1 }}>
                    <TextTheme style={{
                        fontSize: 18,
                        fontWeight: '700',
                        marginBottom: 2,
                    }}>
                        {formatDate(createOn)}
                    </TextTheme>
                    <TextTheme style={{
                        fontSize: 14,
                        opacity: 0.7,
                        fontWeight: '500',
                    }}>
                        {billNo}
                    </TextTheme>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{
                        fontWeight: '800',
                        fontSize: 20,
                        color: formatAmount(payAmount).color,
                    }}>
                        {formatAmount(payAmount).value} {currency}
                    </Text>
                    <TextTheme style={{
                        fontSize: 12,
                        opacity: 0.6,
                        fontWeight: '500',
                    }}>
                        Amount Paid
                    </TextTheme>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={{
                height: 4,
                backgroundColor: 'rgba(156, 163, 175, 0.2)',
                borderRadius: 2,
                overflow: 'hidden',
                marginVertical: 4,
            }}>
                <View style={{
                    height: '100%',
                    width: `${Math.min(completionPercentage, 100)}%`,
                    backgroundColor: statusColors.bg,
                    borderRadius: 2,
                }} />
            </View>

            {/* Main Content */}
            <BackgroundThemeView style={{
                padding: 16,
                borderRadius: 12,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}>
                {/* Customer and Status Row */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                }}>
                    <View style={{ flex: 1 }}>
                        <TextTheme style={{
                            fontSize: 16,
                            fontWeight: '700',
                            marginBottom: 2,
                        }}>
                            {customerName}
                        </TextTheme>
                        <TextTheme style={{
                            fontSize: 14,
                            opacity: 0.7,
                            fontWeight: '500',
                        }}>
                            {type}
                        </TextTheme>
                    </View>

                    <View style={{
                        backgroundColor: statusColors.bg,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        position: 'relative',
                        minWidth: 80,
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            color: statusColors.text,
                            fontWeight: '700',
                            fontSize: 12,
                            textTransform: 'uppercase',
                        }}>
                            {status}
                        </Text>

                        <ShowWhen when={status === 'pending'}>
                            <View style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                width: 16,
                                height: 16,
                                borderRadius: 8,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <AnimatePingBall size={8} backgroundColor="rgb(245, 158, 11)" />
                            </View>
                        </ShowWhen>
                    </View>

                    <AnimateButton
                        style={{
                            padding: 10,
                            borderRadius: 20,
                            marginLeft: 8,
                            backgroundColor: 'rgba(156, 163, 175, 0.1)',
                        }}
                        onPress={onPrint}
                    >
                        <FeatherIcon name="printer" size={18} />
                    </AnimateButton>
                    
                    <ShowWhen when={pendingAmount < 0}>
                        <TouchableOpacity
                            onPress={onPayment}
                            style={{
                                backgroundColor: 'rgb(59, 130, 246)',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                marginLeft: 8,
                            }}
                        >
                            <MaterialDesignIcon name="credit-card-plus-outline" size={14} color="white" />
                        </TouchableOpacity>
                    </ShowWhen>
                </View>

                {/* Financial Information */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'rgba(156, 163, 175, 0.05)',
                    borderRadius: 8,
                    padding: 12,
                }}>
                    <View style={{ flex: 1 }}>
                        <TextTheme style={{
                            fontSize: 12,
                            fontWeight: '600',
                            opacity: 0.7,
                            marginBottom: 2,
                        }}>
                            Total Amount
                        </TextTheme>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: formatAmount(totalAmount).color,
                        }}>
                            {formatAmount(totalAmount).value} {currency}
                        </Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TextTheme style={{
                            fontSize: 12,
                            fontWeight: '600',
                            opacity: 0.7,
                            marginBottom: 2,
                        }}>
                            Pending
                        </TextTheme>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: pendingAmount > 0 ? 'rgb(245, 158, 11)' : 'rgb(16, 185, 129)',
                        }}>
                            {numberToString(pendingAmount)} {currency}
                        </Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TextTheme style={{
                            fontSize: 12,
                            fontWeight: '600',
                            opacity: 0.7,
                            marginBottom: 2,
                        }}>
                            Completion
                        </TextTheme>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: completionPercentage === 100 ? 'rgb(16, 185, 129)' : 'rgb(245, 158, 11)',
                        }}>
                            {Math.round(completionPercentage)}%
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    <ShowWhen when={pendingAmount < 0}>
                        <TouchableOpacity
                            onPress={onPayment}
                            style={{
                                backgroundColor: 'rgb(59, 130, 246)',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                flex: 1,
                            }}
                        >
                            <FeatherIcon name="credit-card" size={14} color="white" />
                            <Text style={{
                                color: 'white',
                                fontWeight: '600',
                                fontSize: 12,
                            }}>
                                Add Payment
                            </Text>
                        </TouchableOpacity>
                    </ShowWhen>
                </View>
            </BackgroundThemeView>
        </View>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    {
                        opacity: pressed ? 0.95 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                ]}
            >
                <CardContent />
            </Pressable>
        );
    }

    return <CardContent />;
}

// import { View } from 'react-native';
// import TextTheme from '../Text/TextTheme';
// import { getMounthName } from '../../Functions/TimeOpration/timeByIndex';
// import BackgroundThemeView from '../View/BackgroundThemeView';
// import { toCapital } from '../../Functions/StringOpations';
// import { Text } from 'react-native';
// import ShowWhen from '../Other/ShowWhen';
// import AnimatePingBall from '../View/AnimatePingBall';
// import AnimateButton from '../Button/AnimateButton';
// import FeatherIcon from '../Icon/FeatherIcon';
// import numberToString from '../../Functions/Numbers/numberToString';
// import { useAppStorage } from '../../Contexts/AppStorageProvider';

// export type BillCardProps = {
//     createOn: string,
//     type: string, // Optional type for future use
//     payAmount: number,
//     totalAmount: number,
//     pendingAmount: number,
//     billNo: string,
//     customerName: string
// }

// export default function BillCard({ createOn, totalAmount = 0, payAmount = 0, billNo, customerName, pendingAmount = 0, type }: BillCardProps): React.JSX.Element {

//     const { currency } = useAppStorage();

//     const status: 'paid' | 'pending' = totalAmount === payAmount ? 'paid' : 'pending';
//     const statusColor = status === 'paid' ? 'rgb(50,200,150)' : 'rgb(250,150,50)';

//     return (
//         <View style={{ gap: 6 }}>
//             <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingInline: 8 }} >
//                 <TextTheme style={{ fontSize: 20, fontWeight: 900 }} >
//                     {getMounthName(parseInt(createOn.split('-')[1]))} {createOn.split('-')[2]}
//                 </TextTheme>
//                 <Text style={{ fontWeight: 900, fontSize: 16, color: payAmount < 0 ? 'red' : 'green' }} >{Math.abs(payAmount)} {currency}</Text>
//             </View >

//             <BackgroundThemeView style={{ padding: 16, borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }} >
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', display: 'flex', alignItems: 'center', width: '100%' }}>
//                     <View style={{ backgroundColor: statusColor, paddingInline: 12, borderRadius: 10, paddingBlock: 8, position: 'relative' }} >
//                         <Text style={{ color: 'white', fontWeight: 900 }} >{toCapital(status)}</Text>

//                         <ShowWhen when={status === 'pending'} >
//                             <BackgroundThemeView style={{ position: 'absolute', top: 2, right: 2, width: 20, aspectRatio: 1, borderRadius: 20, transform: [{ translateX: '50%' }, { translateY: '-50%' }], display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
//                                 <AnimatePingBall size={12} backgroundColor="rgb(250,150,50)" />
//                             </BackgroundThemeView>
//                         </ShowWhen>
//                     </View>

//                     <View>
//                         <TextTheme style={{ paddingLeft: 2, fontWeight: 600 }} >{customerName}</TextTheme>
//                         <TextTheme style={{ paddingLeft: 2, fontWeight: 600 }} >{type}</TextTheme>
//                     </View>
//                     <View style={{ alignItems: 'flex-end' }} >
//                         <TextTheme style={{ fontSize: 12 }} isPrimary={false} >#{billNo}</TextTheme>
//                         <TextTheme style={{ fontSize: 12 }} isPrimary={false} >{createOn}</TextTheme>
//                     </View>
//                 </View>

//                 {/* <TextTheme style={{ paddingLeft: 2, fontWeight: 600 }} >{customerName}</TextTheme> */}

//                 <View style={{ display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'space-between', width: '100%', alignItems: 'center' }} >
//                     <View style={{ flexDirection: 'row', gap: 32 }}>
//                         <View>
//                             <TextTheme style={{ fontSize: 12 }} >Total</TextTheme>
//                             <Text style={{ fontSize: 12, color: totalAmount < 0 ? 'red' : 'green' }} >{Math.abs(totalAmount)} {currency}</Text>
//                         </View>

//                         <View>
//                             <TextTheme style={{ fontSize: 12 }} >Pending</TextTheme>
//                             <TextTheme style={{ fontSize: 12 }} >{numberToString(pendingAmount)} {currency}</TextTheme>
//                         </View>
//                     </View>

//                     <AnimateButton style={{ padding: 8, borderRadius: 20 }}>
//                         <FeatherIcon name="printer" size={20} />
//                     </AnimateButton>
//                 </View>
//             </BackgroundThemeView>
//         </View >
//     );
// }
