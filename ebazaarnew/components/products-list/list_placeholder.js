import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from "rn-placeholder";
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";

const ListPlaceholder = React.memo(({ marginTop, itemsNum, imageWidth, listAreaWidth }) => {
    const bgColor = { backgroundColor: '#f2f2f2' },
        lineStyle = { bgColor, borderRadius: 0 },
        loop = _.times(itemsNum, (n) => n);

    return (
        <ScrollView style={[styles.content]} scrollEnabled={false}>
            { loop.map((v) => 
                <Placeholder key={v} style={{marginTop: v === 0 ? marginTop : 0}} Animation={Fade}>
                    <View style={[CssHelper['flexRowCentered'], styles.listPlaceholderInner]}>
                        <View style={{width: listAreaWidth}}>
                            <PlaceholderMedia style={[bgColor, {width: imageWidth, height: imageWidth}]}/>
                        </View>
                        <View style={styles.listPlaceholderRightBox}>
                            <PlaceholderLine style={[lineStyle, styles.listPlaceholderLine1]}/>
                            <PlaceholderLine style={[lineStyle, styles.listPlaceholderLine2]}/>
                        </View>
                    </View>
                </Placeholder>
            )}
        </ScrollView>
    )
})

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listPlaceholderInner: {
        alignItems: 'flex-start', 
        paddingLeft: 10, 
        paddingRight: 10,
        marginBottom: 10
    },
    listPlaceholderRightBox: {
        paddingLeft: 10, 
        flex: 1, 
        paddingTop: 3
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

ListPlaceholder.propTypes = {
    itemsNum: PropTypes.number,
    marginTop: PropTypes.number,
    imageWidth: PropTypes.number,
    listAreaWidth: PropTypes.string
}

ListPlaceholder.defaultProps = {
    itemsNum: 4,
    marginTop: 20
}

export default ListPlaceholder;