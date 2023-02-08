import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

const SocketIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 64 64" fill={color}>
            <Path d="m61 10h-58a1 1 0 0 0 -1 1v42a1 1 0 0 0 1 1h58a1 1 0 0 0 1-1v-42a1 1 0 0 0 -1-1zm-1 42h-56v-40h56z"/>
            <Path d="m11 29h4v2h-4z"/>
            <Path d="m23 29h4v2h-4z"/>
            <Path d="m18 19h2v5h-2z"/>
            <Path d="m37 29h4v2h-4z"/>
            <Path d="m49 29h4v2h-4z"/>
            <Path d="m44 19h2v5h-2z"/>
            <Path d="m37 40h-10a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8a1 1 0 0 0 -1-1zm-9 2h8v2h-8zm8 6h-8v-2h8z"/>
            <Path d="m7 38h50a1 1 0 0 0 1-1v-22a1 1 0 0 0 -1-1h-50a1 1 0 0 0 -1 1v22a1 1 0 0 0 1 1zm49-2h-23v-20h23zm-48-20h23v20h-23z"/>
            <Path d="m40 42h7v2h-7z"/>
            <Path d="m40 46h6v2h-6z"/>
        </Svg>
    )
})

SocketIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

SocketIcon.defaultProps = {
    color: "#000"
}

export default SocketIcon;