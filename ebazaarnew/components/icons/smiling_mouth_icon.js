import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const SmilingMouth = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 15 46.47 46.47" fill={color}>
            <G>
                <Path d="M3.445,6.322c0-3.423,2.777-6.201,6.201-6.201c3.423,0,6.2,2.777,6.2,6.201c0,3.426-2.777,6.203-6.2,6.203
                    C6.222,12.524,3.445,9.748,3.445,6.322z M31.562,6.322c0-3.423,2.78-6.201,6.203-6.201s6.201,2.777,6.201,6.201
                    c0,3.426-2.777,6.203-6.201,6.203C34.343,12.524,31.562,9.748,31.562,6.322z M46.223,31.72
                    C42.38,40.607,33.38,46.349,23.294,46.349c-10.301,0-19.354-5.771-23.064-14.703c-0.636-1.53,0.089-3.286,1.62-3.922
                    c0.376-0.155,0.766-0.229,1.15-0.229c1.176,0,2.292,0.696,2.771,1.851c2.777,6.685,9.655,11.004,17.523,11.004
                    c7.69,0,14.528-4.322,17.421-11.012c0.658-1.521,2.424-2.222,3.943-1.562C46.181,28.433,46.881,30.199,46.223,31.72z"/>
            </G>
        </Svg>
    );
});

SmilingMouth.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

SmilingMouth.defaultProps = {
    color: "#000"
}

export default SmilingMouth;