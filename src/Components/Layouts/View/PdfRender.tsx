/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';

interface Props {
    pdfBase64: string;
}

const PDFRenderer2: React.FC<Props> = ({ pdfBase64 }) => {
    return (
        <View style={styles.container}>
            <Pdf
                source={{ uri: pdfBase64 || '' }}
                style={{ flex: 1 }}
                onError={(error) => console.log('PDF load error:', error)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default PDFRenderer2;
