// IframeRenderer.tsx (React Native version)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
    htmlString: string;
}

const PDFRenderer: React.FC<Props> = ({ htmlString }) => {
    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html: htmlString }}
                style={styles.webview}
                scalesPageToFit={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                bounces={false}
                overScrollMode="never"
                scrollEnabled={true}
                nestedScrollEnabled={true}
                automaticallyAdjustContentInsets={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});

export default PDFRenderer;
