import React from 'react';
import PropTypes from 'prop-types';
import Svg, { G, Circle } from 'react-native-svg';

const MoreIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 384 384" fill={color}>
            <G>
                <G>
                    <Circle cx="192" cy="42.667" r="42.667"/>
                </G>
            </G>
            <G>
                <G>
                    <Circle cx="192" cy="192" r="42.667"/>
                </G>
            </G>
            <G>
                <G>
                    <Circle cx="192" cy="341.333" r="42.667"/>
                </G>
            </G>
        </Svg>
    )
})

MoreIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

MoreIcon.defaultProps = {
    color: "#000"
}

export default MoreIcon;