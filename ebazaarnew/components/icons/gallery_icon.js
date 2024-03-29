import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const GalleryIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 28.907 28.907" fill={color}>
            <G>
                <G id="c84_landscape">
                    <Path d="M2.625,24.215V5.291H0.509C0.229,5.291,0,5.519,0,5.8v20.899c0,0.282,0.229,0.511,0.509,0.511h24.155
                        c0.281,0,0.51-0.229,0.51-0.511v-1.974H3.136C2.851,24.725,2.625,24.495,2.625,24.215z"/>
                    <Path d="M28.396,1.698H4.244c-0.282,0-0.509,0.229-0.509,0.509v20.898c0,0.282,0.228,0.513,0.509,0.513h24.153
                        c0.281,0,0.51-0.23,0.51-0.513V2.207C28.906,1.927,28.678,1.698,28.396,1.698z M10.501,3.598c1.494,0,2.708,1.213,2.708,2.71
                        c0,1.499-1.214,2.707-2.708,2.707c-1.496,0-2.709-1.208-2.709-2.707C7.792,4.811,9.005,3.598,10.501,3.598z M27.25,17.306h-0.033
                        H7.269H5.671v-0.208l4.258-4.865l2.396,1.616l2.792-4.785l3.244,2.3l2.932-6.077L27.25,17.08V17.306z"/>
                </G>
                <G id="Capa_1_147_">
                </G>
            </G>
        </Svg>
    )
})

GalleryIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

GalleryIcon.defaultProps = {
    color: "#000"
}

export default GalleryIcon;