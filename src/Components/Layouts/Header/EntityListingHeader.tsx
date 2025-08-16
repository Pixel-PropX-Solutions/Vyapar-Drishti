import { Animated, TextInput, View } from "react-native"
import TextTheme from "../../Ui/Text/TextTheme"
import AnimateButton from "../../Ui/Button/AnimateButton"
import FeatherIcon from "../../Icon/FeatherIcon"
import navigator from "../../../Navigation/NavigationService"
import ShowWhen from "../../Other/ShowWhen"
import AnimatePingBall from "../View/AnimatePingBall"
import BackgroundThemeView from "../View/BackgroundThemeView"
import { useTheme } from "../../../Contexts/ThemeProvider"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import useBinaryAnimateValue from "../../../Hooks/useBinaryAnimateValue"

type Props = {
    title: string,
    paddingBlock?: number
    hasBackButton?: boolean,
    onPressNotification?: () => void
    onPressFilter?: () => void,
    searchButtonOpations?: {
        onSearch?: (query: string) => void,
        onQueryChange?: (query: string) => void,
        callbackTimeout?: number,
        placeholder?: string
    },
}

export default function EntityListingHeader({title, onPressFilter, searchButtonOpations, onPressNotification, hasBackButton=false, paddingBlock=10}: Props): React.JSX.Element {

    const [isSearchBarOpen, setSearchBarOpen] = useState<boolean>(false);

    const animate0to1 = useBinaryAnimateValue({value: 1, duration: 200});

    useEffect(() => {
        if(isSearchBarOpen == false) {
            animate0to1.animateTo1();
        }
    }, [isSearchBarOpen])

    return (
        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', paddingBlock, justifyContent: 'space-between', gap: 4}} >
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}} >
                <ShowWhen when={hasBackButton} >
                    <AnimateButton onPress={() => {navigator.goBack()}} style={{aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}} >
                        <FeatherIcon name='chevron-left' size={20} />
                    </AnimateButton>
                </ShowWhen>

                <Animated.View style={{
                    display: isSearchBarOpen ? 'none' : 'flex',    
                    transform: [{scale: animate0to1.value.interpolate({
                        inputRange: [0, 1], outputRange: [0.5, 1]
                    })}], 
                    
                    opacity: animate0to1.value.interpolate({
                        inputRange: [0, 1], outputRange: [0, 1]
                    })
                }} >
                    <TextTheme fontSize={18} fontWeight={900} >{title}</TextTheme>
                </Animated.View>
            </View>

            <View style={{flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1, justifyContent: "flex-end", height: 60}} >
                <ShowWhen when={!!searchButtonOpations} >
                    <ShowWhen when={isSearchBarOpen} >
                        <SearchBarSection 
                            {...searchButtonOpations}
                            setIsOpen={setSearchBarOpen}
                        />
                    </ShowWhen>
                    
                    <Animated.View style={{
                        display: isSearchBarOpen ? 'none' : 'flex',
                        transform: [{scale: animate0to1.value.interpolate({
                            inputRange: [0, 1], outputRange: [0.5, 1]
                        })}], 
                        
                        opacity: animate0to1.value.interpolate({
                            inputRange: [0, 1], outputRange: [0, 1]
                        })
                    }} >
                        <AnimateButton 
                            style={{aspectRatio: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 40}} 
                            onPress={() => {
                                animate0to1.animateTo0({}, () => {
                                    setSearchBarOpen(true)
                                })
                            }} 
                        >
                            <FeatherIcon name='search' size={20} />
                        </AnimateButton>
                    </Animated.View>
                </ShowWhen>

                <ShowWhen when={!!onPressFilter} >
                    <AnimateButton onPress={onPressFilter} style={{aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}} >
                        <FeatherIcon name='filter' size={20} />
                    </AnimateButton>
                </ShowWhen>
      
                <ShowWhen when={!!onPressNotification} >
                    <AnimateButton
                        onPress={() => {navigator.navigate('notification-screen')}}
                        style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                    >
                        <FeatherIcon name="bell" size={20} />
                        <BackgroundThemeView style={{
                            position: 'absolute',
                            transform: [{ translateX: 5 }, { translateY: -5 }],
                            borderRadius: '50%',
                            padding: 2,
                        }} >
                            <AnimatePingBall size={7} scale={2} duration={500} backgroundColor={'rgb(250,50,50)'} />
                        </BackgroundThemeView>
                    </AnimateButton>
                </ShowWhen>
            </View>
        </View>
    )
}



type SearchBarSectionProps = {
    onSearch?: (query: string) => void,
    onQueryChange?: (query: string) => void,
    callbackTimeout?: number,
    placeholder?: string
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

function SearchBarSection({onSearch, onQueryChange, callbackTimeout=250, setIsOpen, placeholder}: SearchBarSectionProps) {

    const {primaryColor} = useTheme();

    const animate0to1 = useBinaryAnimateValue({value: 0, duration: 200});
    const [searchQuery, setSearchQuery] = useState<string>('');
    const input = useRef<TextInput>(null)
    const timeout = useRef<NodeJS.Timeout>(undefined)

    function handleBlur() {
        if(searchQuery.trim()) return;
        animate0to1.animateTo0({}, () => {
            setIsOpen(false);
        })
    }

    function handleOnChangeQuery(qurey: string) {
        setSearchQuery(qurey);

        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            if(onQueryChange)
                onQueryChange(qurey);
        }, callbackTimeout)
    }

    useEffect(() => {
        animate0to1.animateTo1();

        const timeout = setTimeout(() => {
            input.current?.focus();
        }, 250)

        return () => clearTimeout(timeout);
    }, [])

    return (
        <Animated.View 
            style={{flex: 1, borderWidth: 2, borderColor: "black", flexDirection: "row", alignItems: 'center', gap: 4, borderRadius: 100, height: 32, position: 'relative', padding: 2, overflow: 'hidden',
                
            transform: [{scale: animate0to1.value.interpolate({
                inputRange: [0, 1], outputRange: [0.5, 1]
            })}], 
            
            opacity: animate0to1.value.interpolate({
                inputRange: [0, 1], outputRange: [0, 1]
            })
        }} >
            <AnimateButton style={{aspectRatio: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center', height: '100%'}} >
                <FeatherIcon name='search' size={16} />
            </AnimateButton>
            
            <TextInput 
                ref={input}
                value={searchQuery}
                onChangeText={handleOnChangeQuery}
                placeholder={placeholder ?? "Search Query"}
                placeholderTextColor={primaryColor}
                
                style={{
                    opacity: searchQuery ? 1 : 0.7, color: primaryColor, 
                    fontFamily: 'Roboto-Regular', fontSize: 12, alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0, height: "100%", borderTopRightRadius: 40, borderBottomRightRadius: 40, paddingRight: 10, flex: 1,
                }}

                onBlur={handleBlur}

                onSubmitEditing={() => {
                    if(onSearch) onSearch(searchQuery.trim())
                }}                
            />
        </Animated.View>
    )
}