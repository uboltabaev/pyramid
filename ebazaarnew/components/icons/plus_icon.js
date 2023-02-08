import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const PlusIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 357 357" fill={color}>
            <G>
                <G>
                    <Path d="M357,204H204v153h-51V204H0v-51h153V0h51v153h153V204z"/>
                </G>
            </G>
        </Svg>
    );
});

PlusIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

PlusIcon.defaultProps = {
    color: "#000"
}

export default PlusIcon;