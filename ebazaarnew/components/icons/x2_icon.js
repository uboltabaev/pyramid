import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Polygon, G } from 'react-native-svg';

const X2Icon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 348.333 348.334" fill={color}>
            <G>
                <Polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"/>
            </G>
        </Svg>
    );
});

X2Icon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

X2Icon.defaultProps = {
    color: "#000"
}

export default X2Icon;