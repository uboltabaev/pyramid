import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const NotebookIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 512 512" fill={color}>
            <G>
                <Path d="M496,344H471.039L472,144a40.045,40.045,0,0,0-40-40H80a40.037,40.037,0,0,0-40,39.962L39.038,344H16a8,8,0,0,0-8,8v32a40.045,40.045,0,0,0,40,40H464a40.045,40.045,0,0,0,40-40V352A8,8,0,0,0,496,344ZM56,144a24.027,24.027,0,0,1,24-24H432a24.019,24.019,0,0,1,24,23.962L455.039,344h-400ZM293.439,360l-4.5,16H222.246l-4-16ZM488,384a24.027,24.027,0,0,1-24,24H48a24.027,24.027,0,0,1-24-24V360H201.754l6.485,25.94A8,8,0,0,0,216,392h79a8,8,0,0,0,7.7-5.834L310.06,360H488Z"/>
                <Path d="M448,328V136a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8V328a8,8,0,0,0,8,8H440A8,8,0,0,0,448,328Zm-16-8H80V144H432Z"/>
            </G>
        </Svg>
    )
})

NotebookIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

NotebookIcon.defaultProps = {
    color: "#000"
}

export default NotebookIcon;