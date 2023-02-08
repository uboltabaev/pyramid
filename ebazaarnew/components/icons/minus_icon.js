import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const MinusIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 83 83" fill={color}>
            <G>
                <Path d="M81,36.166H2c-1.104,0-2,0.896-2,2v6.668c0,1.104,0.896,2,2,2h79c1.104,0,2-0.896,2-2v-6.668
                    C83,37.062,82.104,36.166,81,36.166z"/>
            </G>
        </Svg>
    );
});

MinusIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

MinusIcon.defaultProps = {
    color: "#000"
}

export default MinusIcon;