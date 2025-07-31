/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { ItemSelectorModal } from './Selectors/ItemSelectorModal';
import TextTheme from '../Ui/Text/TextTheme';
type CountryInfo = { name: string, states: string[] };

const countryData: CountryInfo[] = require('../../Assets/Jsons/country-states.json');



export function StateSelectorModal({ visible, setVisible, country, state, field = 'mailing_state', setState }: {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    country: string,
    state: string,
    field?: string,
    setState: (field: string, value: string) => void
}): React.JSX.Element {

    console.log('countryData in state selector countryData.find', countryData.find(item => item.name === country));

    const stateData: Array<string> = countryData.find(item => item.name === country)?.states || [];

    console.log('country in state selector stateData', stateData);

    const selected = (countryData.find(item => item.name === country)?.states.find((item) => item === state) ?? null);

    console.log('country in state selector selected', selected);

    function updateState(stateInfo: string) {
        setState(field, stateInfo);
    }

    return (
        <ItemSelectorModal<string>
            title="Select State"
            allItems={stateData}
            isItemSelected={!!selected}
            keyExtractor={(item) => item}
            filter={(item, val) => (
                item.toLowerCase().startsWith(val)
            )}
            onSelect={updateState}
            visible={visible}
            setVisible={setVisible}
            SelectedItemContent={
                <View>
                    <TextTheme color="white" fontWeight={700} fontSize={14} >
                        {selected}
                    </TextTheme>
                </View>
            }

            renderItemContent={(item) => (<>
                <TextTheme fontSize={16} fontWeight={900} >{item}</TextTheme>
                {/* <TextTheme style={{ fontWeight: 600, fontSize: 16 }}>{item.currency}</TextTheme> */}
            </>)}
        />
    );
}
