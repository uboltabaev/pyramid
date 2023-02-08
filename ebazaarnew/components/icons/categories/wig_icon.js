import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G, Rect } from 'react-native-svg';

const WigIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 496 496" fill={color}>
            <G>
                <G>
                    <G>
                        <Path d="M467.624,386.168L462.4,379.2C432.48,339.296,416,289.864,416,240v-72C416,75.368,340.632,0,248,0S80,75.368,80,168v72
                            c0,49.864-16.48,99.296-46.4,139.2l-5.224,6.968l7.384,4.608c1.592,1,37.616,23.048,115.224,34.504
                            c-5.8,6.28-12.144,12.152-19.04,17.512l-12.96,10.08L129.752,496h236.496l10.776-43.12l-12.96-10.08
                            c-6.896-5.368-13.24-11.232-19.04-17.512c77.608-11.456,113.632-33.512,115.216-34.512L467.624,386.168z M354.232,455.432
                            l4.744,3.688L353.752,480H142.248l-5.224-20.88l4.744-3.688c39.736-30.912,63.448-76.632,65.984-126.52
                            C220.352,333.416,233.864,336,248,336s27.648-2.584,40.248-7.096C290.784,378.792,314.496,424.52,354.232,455.432z M144,216v-40
                            c0-13.232,10.768-24,24-24h40.096c48.536,0,95.96-13.6,137.12-39.32c2.824-1.76,6.792,0.488,6.792,3.76V216
                            C352,273.344,305.344,320,248,320S144,273.344,144,216z M333.12,410.752c-18.416-25.56-28.648-56.296-29.064-88.728
                            C342.048,301.856,368,261.928,368,216v-99.56c0-11.272-9.168-20.44-20.44-20.44c-3.832,0-7.568,1.072-10.832,3.112
                            C298.12,123.24,253.632,136,208.096,136H168c-22.056,0-40,17.944-40,40v40c0,45.928,25.952,85.856,63.944,106.024
                            c-0.416,32.432-10.64,63.176-29.056,88.728c-60.016-7.808-96.312-22.472-111.016-29.544C80.384,339.96,96,290.176,96,240v-72
                            c0-83.816,68.184-152,152-152s152,68.184,152,152v72c0,50.192,15.616,99.976,44.152,141.224
                            C429.512,388.296,393.4,402.92,333.12,410.752z"/>
                        <Rect x="168" y="448" width="128" height="16"/>
                        <Rect x="312" y="448" width="16" height="16"/>
                    </G>
                </G>
            </G>
        </Svg>
    )
})

WigIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

WigIcon.defaultProps = {
    color: "#000"
}

export default WigIcon;