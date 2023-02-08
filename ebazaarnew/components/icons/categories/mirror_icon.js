import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G, Rect } from 'react-native-svg';

const MirrorIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 512 512" fill={color}>
            <G>
                <G>
                    <Path d="M324.056,67.235C305.496,43.492,281.325,30.416,256,30.416s-49.496,13.076-68.056,36.819
                        c-19.859,25.402-30.795,59.494-30.795,95.996c0,36.502,10.937,70.594,30.795,95.996c18.561,23.744,42.731,36.819,68.056,36.819
                        s49.496-13.076,68.056-36.819c19.859-25.402,30.795-59.494,30.795-95.996S343.915,92.638,324.056,67.235z M312.076,249.861
                        C296.459,269.837,276.545,280.84,256,280.84c-14.298,0-28.291-5.335-40.743-15.31l22.995-22.995l-10.753-10.754l-23.255,23.255
                        c-1.473-1.652-2.915-3.374-4.32-5.173c-5.992-7.665-11.052-16.258-15.16-25.529l31.117-31.117l-10.753-10.754l-26.185,26.185
                        c-4.31-14.183-6.587-29.521-6.587-45.415c0-33.124,9.791-63.889,27.568-86.629C215.541,56.626,235.455,45.624,256,45.624
                        c20.334,0,40.049,10.783,55.592,30.373l-81.373,81.372l10.753,10.754l79.369-79.369c6.394,10.749,11.283,22.771,14.542,35.641
                        l-67.954,67.955l10.753,10.754l60.623-60.623c0.869,6.778,1.338,13.705,1.338,20.751
                        C339.644,196.356,329.853,227.121,312.076,249.861z"/>
                </G>
            </G>
            <G>
                <G>
                    <Path d="M348.02,48.503C323.569,17.226,290.888,0,256,0s-67.569,17.226-92.02,48.503c-24.019,30.725-37.247,71.47-37.247,114.729
                        c0,37.716,10.398,74.49,29.28,103.549c17.655,27.169,41.885,46.465,68.726,54.878v36.521l-11.829,35.485v75.246
                        c0,23.76,19.329,43.089,43.089,43.089s43.089-19.329,43.089-43.089v-75.246l-11.829-35.485v-36.521
                        c26.841-8.413,51.07-27.709,68.726-54.878c18.884-29.058,29.282-65.833,29.282-103.549
                        C385.267,119.973,372.039,79.228,348.02,48.503z M277.798,308.535l-5.746,1.449v50.664l11.829,35.485v72.778
                        c0,15.374-12.507,27.881-27.881,27.881s-27.881-12.507-27.881-27.881v-72.778l11.829-35.485v-50.664l-5.746-1.449
                        c-53.46-13.478-92.261-74.587-92.261-145.304c0-81.621,51.167-148.024,114.059-148.024s114.059,66.403,114.059,148.024
                        C370.059,233.949,331.258,295.057,277.798,308.535z"/>
                </G>
            </G>
            <G>
                <G>
                    <Rect x="248.396" y="462.321" width="15.208" height="15.208"/>
                </G>
            </G>
            <G>
                <G>
                    <Rect x="248.554" y="206.258" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -76.1966 243.7698)" width="15.208" height="15.208"/>
                </G>
            </G>
        </Svg>
    )
})

MirrorIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

MirrorIcon.defaultProps = {
    color: "#000"
}

export default MirrorIcon;