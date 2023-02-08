import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import BubbleIcon from '../icons/bubble_icon';

const QuestionBubble = React.memo(({size, text, textStyle}) => {
    return (
        <View style={{width: size, height: size}}>
            <Text style={[styles.text, textStyle]}>
                {text}
            </Text>
            <View style={{transform: [{scaleX: -1}]}}>
                <BubbleIcon width={size} height={size}/>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    text: {
        position: 'absolute', 
        fontSize: 14, 
        left: 10, 
        top: 1
    },
});

QuestionBubble.propTypes = {
    size: PropTypes.number,
    text: PropTypes.string,
    textStyle: PropTypes.object
}

QuestionBubble.defaultProps = {
    text: '?',
    size: 30
}

export default QuestionBubble;