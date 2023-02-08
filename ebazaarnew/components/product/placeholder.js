import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Placeholder, PlaceholderLine } from "rn-placeholder";
import CssHelper from '../../helpers/css_helper';

const ProductPlaceholder = React.memo(() => {
    return (
        <View style={styles.content}>
            <ScrollView>
                <Placeholder>
                    <PlaceholderLine style={[styles.line, styles.line100]}/>
                    <PlaceholderLine style={[styles.line, styles.line100]}/>
                    <PlaceholderLine style={[styles.line, styles.line30]}/>
                    <PlaceholderLine style={[styles.line, styles.line40]}/>
                    <View style={styles.gap1}/>
                    <PlaceholderLine style={[styles.line, styles.line40]}/>
                    <PlaceholderLine style={[styles.line, styles.line60]}/>
                    <View style={[CssHelper['flexRowCentered'], styles.r]}>
                        <PlaceholderLine style={[styles.line, styles.red]}/>
                        <PlaceholderLine style={[styles.line, styles.yellow]}/>
                    </View>
                    <View style={styles.gap1}/>
                    <PlaceholderLine style={[styles.line, styles.line40]}/>
                    <PlaceholderLine style={[styles.line, styles.line70]}/>
                    <PlaceholderLine style={[styles.line, styles.line25]}/>
                    <View style={styles.gap1}/>
                    <PlaceholderLine style={[styles.line, styles.line40]}/>
                    <PlaceholderLine style={[styles.line, styles.line70]}/>
                    <PlaceholderLine style={[styles.line, styles.line25]}/>
                </Placeholder>
            </ScrollView>
        </View>
    )
})

const styles = StyleSheet.create({
    content: {
        margin: 15,
        marginTop: 20,
        flex: 1
    },
    gap1: {
        height: 25
    },
    line: {
        height: 12,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        marginBottom: 8
    },
    line100: {
        width: '100%'
    },
    line25: {
        width: '25%', 
    },
    line30: {
        width: '30%', 
    },
    line40: {
        width: '40%', 
    },
    line60: {
        width: '60%', 
    },
    line70: {
        width: '70%', 
    },
    red: {
        width: '30%',
        backgroundColor: '#fe4646',
        borderWidth: 1,
        borderColor: '#ad393c',
        height: 20,
        borderRadius: 2,
        marginRight: 10
    },
    yellow: {
        width: '30%',
        backgroundColor: '#fe9b00',
        borderWidth: 1,
        borderColor: '#cd8e31',
        height: 20,
        borderRadius: 2
    },
    r: {
        justifyContent: 'flex-start'
    }
});

export default ProductPlaceholder;