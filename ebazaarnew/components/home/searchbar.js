import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated } from 'react-native';
import i18n from 'i18n-js';
import SearchIcon from '../icons/search_icon';

export const SEARCH_BAR_MODE = Object.freeze({
    HOME: 'home',
    OTHER: 'other'
});

function Searchbar({ backgroundColor, scrollY, mode, navigation }) {
    const [text, setText] = useState('');
    let opacity = null;
    if (mode === SEARCH_BAR_MODE.HOME) {
        opacity = scrollY.interpolate({
            inputRange: [45, 45],
            outputRange: [0, 0]
        });
    }
    const goSearch = () => {
        navigation.navigate('Search');
    };

    return (
        <View style={styles.container}>
            { mode === SEARCH_BAR_MODE.HOME &&
                <Animated.View style={[styles.gradient, {opacity}]}/>
            }
            <View style={[styles.inputContainer, {backgroundColor}, mode === SEARCH_BAR_MODE.OTHER && (styles.inputContainerOther)]}>
                <View>
                    <SearchIcon width={24} height={24} color="#343434"/>
                </View>
                <TouchableWithoutFeedback onPress={goSearch}>
                    <View style={styles.input}>
                        <Text style={styles.inputText} numberOfLines={1}>
                            {i18n.t('home:searchbar:placeholder:man_watch', {defaultValue: 'мужские часы'})}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center',
        width: '100%',
        height: 42,
    },
    gradient: {
        position: 'absolute',
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center',
        width: '100%',
        borderRadius: 9,
        height: 42,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center',
        width: '100%',
        borderRadius: 20,
        height: 38,
        paddingLeft: 10,
        marginHorizontal: 2
    },
    inputContainerOther: {
        borderRadius: 20
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingTop: 2,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10
    },
    inputText: {
        color: "#bfbfbf",
    }
});

Searchbar.propTypes = {
    backgroundColor: PropTypes.string,
    scrollY: PropTypes.object,
    mode: PropTypes.string
}

Searchbar.defaultProps = {
    backgroundColor: "#fff",
    mode: SEARCH_BAR_MODE.OTHER
}

export default Searchbar;