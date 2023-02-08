import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const ListIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 409.6 409.6" fill={color}>
            <G>
                <G>
                    <Path d="M392.533,17.067H17.067C7.641,17.067,0,24.708,0,34.133S7.641,51.2,17.067,51.2h375.467
                        c9.426,0,17.067-7.641,17.067-17.067S401.959,17.067,392.533,17.067z"/>
                </G>
            </G>
            <G>
                <G>
                    <Path d="M392.533,187.733H17.067C7.641,187.733,0,195.374,0,204.8s7.641,17.067,17.067,17.067h375.467
                        c9.426,0,17.067-7.641,17.067-17.067S401.959,187.733,392.533,187.733z"/>
                </G>
            </G>
            <G>
                <G>
                    <Path d="M392.533,358.4H17.067C7.641,358.4,0,366.041,0,375.467s7.641,17.067,17.067,17.067h375.467
                        c9.426,0,17.067-7.641,17.067-17.067S401.959,358.4,392.533,358.4z"/>
                </G>
            </G>
        </Svg>
    )
})

ListIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

ListIcon.defaultProps = {
    color: "#000"
}

export default ListIcon;