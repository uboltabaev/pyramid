class ColorHelper {
    static validateRgb() {
        return typeof color === 'object' &&
        color.length === 3               &&
        Math.min.apply(null, color) >= 0 &&
        Math.max.apply(null, color) <= 255;  
    }
    static validateHex(color) {
        return color.match(/^\#?(([0-9a-f]{3}){1,2})$/i);
    }
    static hexToRgb(color) {
        var hex    = color.replace(/^\#/, '');
        var length = hex.length;
        return     [
           parseInt(length === 6 ? hex['0'] + hex['1'] : hex['0'] + hex['0'], 16),
           parseInt(length === 6 ? hex['2'] + hex['3'] : hex['1'] + hex['1'], 16),
           parseInt(length === 6 ? hex['4'] + hex['5'] : hex['2'] + hex['2'], 16)
        ];
    }
    static rgbToHex(color) {
        return '#' +
        ('0' + parseInt(color['0'], 10).toString(16)).slice(-2) +
        ('0' + parseInt(color['1'], 10).toString(16)).slice(-2) +
        ('0' + parseInt(color['2'], 10).toString(16)).slice(-2);  
    }
}

export default ColorHelper;