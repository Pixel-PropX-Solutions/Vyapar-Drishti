/* eslint-disable react-native/no-inline-styles */
import { TextInput, View } from 'react-native';
import TextTheme from '../../Ui/Text/TextTheme';
import AnimateButton from '../../Ui/Button/AnimateButton';
import FeatherIcon from '../../Icon/FeatherIcon';
import navigator from '../../../Navigation/NavigationService';
import ShowWhen from '../../Other/ShowWhen';
import AnimatePingBall from '../View/AnimatePingBall';
import BackgroundThemeView from '../View/BackgroundThemeView';
import { useTheme } from '../../../Contexts/ThemeProvider';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

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

export default function EntityListingHeader({
    title,
    onPressFilter,
    searchButtonOpations,
    onPressNotification,
    hasBackButton = false,
    paddingBlock = 10
}: Props): React.JSX.Element {

    const [isSearchBarOpen, setSearchBarOpen] = useState<boolean>(false);

    return (
        <View style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            paddingBlock,
            justifyContent: 'space-between',
            gap: 4
        }} >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} >
                <ShowWhen when={hasBackButton} >
                    <AnimateButton
                        onPress={() => { navigator.goBack(); }}
                        style={{ aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <FeatherIcon name="chevron-left" size={20} />
                    </AnimateButton>
                </ShowWhen>

                {!isSearchBarOpen && (
                    <TextTheme fontSize={18} fontWeight={900}>{title}</TextTheme>
                )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end', height: 60 }} >
                <ShowWhen when={!!searchButtonOpations} >
                    <ShowWhen when={isSearchBarOpen} >
                        <SearchBarSection
                            {...searchButtonOpations}
                            setIsOpen={setSearchBarOpen}
                        />
                    </ShowWhen>

                    {!isSearchBarOpen && (
                        <AnimateButton
                            style={{ aspectRatio: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 40 }}
                            onPress={() => setSearchBarOpen(true)}
                        >
                            <FeatherIcon name="search" size={20} />
                        </AnimateButton>
                    )}
                </ShowWhen>

                <ShowWhen when={!!onPressFilter} >
                    <AnimateButton
                        onPress={onPressFilter}
                        style={{ aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <FeatherIcon name="filter" size={20} />
                    </AnimateButton>
                </ShowWhen>

                <ShowWhen when={!!onPressNotification} >
                    <AnimateButton
                        onPress={() => { navigator.navigate('notification-screen'); }}
                        style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                    >
                        <FeatherIcon name="bell" size={20} />
                        <BackgroundThemeView style={{
                            position: 'absolute',
                            transform: [{ translateX: 5 }, { translateY: -5 }],
                            borderRadius: 50,
                            padding: 2,
                        }} >
                            <AnimatePingBall size={7} scale={2} duration={500} backgroundColor={'rgb(250,50,50)'} />
                        </BackgroundThemeView>
                    </AnimateButton>
                </ShowWhen>
            </View>
        </View>
    );
}


type SearchBarSectionProps = {
    onSearch?: (query: string) => void,
    onQueryChange?: (query: string) => void,
    callbackTimeout?: number,
    placeholder?: string
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

function SearchBarSection({
    onSearch,
    onQueryChange,
    callbackTimeout = 250,
    setIsOpen,
    placeholder
}: SearchBarSectionProps) {

    const { primaryColor } = useTheme();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const input = useRef<TextInput>(null);
    const timeout = useRef<NodeJS.Timeout>();

    function handleBlur() {
        if (searchQuery.trim()) { return; }
        setIsOpen(false);
    }

    function handleOnChangeQuery(query: string) {
        setSearchQuery(query);

        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            if (onQueryChange) { onQueryChange(query); }
        }, callbackTimeout);
    }

    useEffect(() => {
        const id = setTimeout(() => {
            try {
                input.current?.focus();
            } catch (e) {
                console.warn("Focus failed", e);
            }
        }, 400);
        return () => clearTimeout(id);
    }, []);

    return (
        <View
            style={{
                flex: 1,
                borderWidth: 2,
                borderColor: 'black',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                borderRadius: 100,
                height: 32,
                position: 'relative',
                padding: 2,
            }} >
            <AnimateButton style={{ aspectRatio: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center', height: '100%' }} >
                <FeatherIcon name="search" size={16} />
            </AnimateButton>

            <TextInput
                ref={input}
                value={searchQuery}
                onChangeText={handleOnChangeQuery}
                placeholder={placeholder ?? 'Search Query'}
                placeholderTextColor={primaryColor}
                style={{
                    opacity: searchQuery ? 1 : 0.7,
                    color: primaryColor,
                    fontFamily: 'Roboto-Regular',
                    fontSize: 12,
                    margin: 0,
                    padding: 0,
                    height: '100%',
                    borderTopRightRadius: 40,
                    borderBottomRightRadius: 40,
                    paddingRight: 10,
                    flex: 1,
                }}
                onBlur={handleBlur}
                onSubmitEditing={() => {
                    if (onSearch) { onSearch(searchQuery.trim()); }
                }}
            />

            <AnimateButton
                style={{ aspectRatio: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center', height: '100%' }}
                onPress={() => setIsOpen(false)}
            >
                <FeatherIcon name="x" size={16} />
            </AnimateButton>
        </View >
    );
}
