import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const SmartphoneIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 93.169 93.169" fill={color}>
            <G>
                <Path d="M64.902,0H28.265c-3.711,0-6.72,3.009-6.72,6.72v79.729c0,3.712,3.008,6.72,6.72,6.72h36.637
    c3.713,0,6.722-3.008,6.722-6.72V6.72C71.623,3.009,68.615,0,64.902,0z M42.088,3.973h8.991c0.323,0,0.586,0.263,0.586,0.587
    c0,0.323-0.263,0.586-0.586,0.586h-8.991c-0.324,0-0.586-0.263-0.586-0.586C41.502,4.236,41.765,3.973,42.088,3.973z M33.126,2.563
    c0.518,0,0.938,0.42,0.938,0.938c0,0.518-0.419,0.938-0.938,0.938s-0.938-0.42-0.938-0.938C32.188,2.983,32.608,2.563,33.126,2.563
    z M28.876,2.001c0.829,0,1.5,0.672,1.5,1.5c0,0.828-0.671,1.5-1.5,1.5s-1.5-0.672-1.5-1.5C27.376,2.673,28.047,2.001,28.876,2.001z
        M48.93,89.758h-4.691c-1.488,0-2.693-1.205-2.693-2.691c0-1.487,1.205-2.692,2.693-2.692h4.691c1.488,0,2.693,1.205,2.693,2.692
    C51.623,88.553,50.418,89.758,48.93,89.758z M68.777,82.248H24.391V10.92h44.386V82.248z"/>
            </G>
        </Svg>
    )
})

SmartphoneIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

SmartphoneIcon.defaultProps = {
    color: "#000"
}

export default SmartphoneIcon;