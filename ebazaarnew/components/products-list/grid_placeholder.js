import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from "rn-placeholder";
import _ from 'underscore';
import {SCREEN_WIDTH} from "../../constants/app";

const Card = React.memo(({ even }) => {
    const bgColor = {backgroundColor: '#f2f2f2'},
        lineStyle = {bgColor, borderRadius: 0};

    const w = (Math.round(SCREEN_WIDTH) / 2) - 10;

    return (
        <View style={{flex: 1, borderRadius: 5, marginRight: !even ? 6 : 0, marginBottom: 10}}>
            <Surface style={{elevation: 1, width: 'auto'}}>
                <Placeholder Animation={Fade}>
                    <PlaceholderMedia style={[bgColor, {width: '100%', height: w}, styles.topRadius]}/>
                    <View style={{padding: 10, paddingBottom: 50}}>
                        <PlaceholderLine style={[lineStyle, styles.listPlaceholderLine1, {width: '100%'}]}/>
                        <PlaceholderLine style={[lineStyle, styles.listPlaceholderLine2]}/>
                    </View>
                </Placeholder>
            </Surface>
        </View>
    )
})

const GridPlaceholder = React.memo(({ itemsNum }) => {

    const loop = _.times(itemsNum, (n) => n);
    
    return (
        <FlatList data={loop}
            numColumns={2}
            columnWrapperStyle={{paddingHorizontal: 10}}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
                return(
                    <Card key={index} even={(index + 1) % 2 === 0} />
                )
            }}
        />
    )
})

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10
    },
    topRadius: {
        borderTopLeftRadius: 5, 
        borderTopRightRadius: 5
    },
    listPlaceholderLine1: {
        width: '90%', 
        height: 14, 
        marginBottom: 7
    },
    listPlaceholderLine2: {
        width: '70%', 
        height: 18
    }
});

GridPlaceholder.propTypes = {
    itemsNum: PropTypes.number,
    marginTop: PropTypes.number
}

GridPlaceholder.defaultProps = {
    itemsNum: 4,
    marginTop: 20
}

export default GridPlaceholder;