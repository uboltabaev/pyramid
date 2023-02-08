export const MASK_TYPES = Object.freeze({
    CUSTOM: 'custom',
    CELL_PHONE: 'cell-phone',
    CREDIT_CARD: 'credit-card'
});

export const CUSTOM_MASKS = Object.freeze({
    USER_CELL_PHONE: '(99) 999-99-99'
});

const CELL_PHONE_MASK = '+999 (99) 999 99 99';
const CREDIT_CARD_MASK = '9999 9999 9999 9999';

class MaskHelper {
    constructor(type, mask) {
        if (type === undefined)
            console.error('Type is not provided');
        this.type = type;
        if (mask !== undefined)
            this.mask = mask;
    }
    getType() {
        return this.type;
    }
    getValue(value) {
        let cleanedValue = this.removeNotNumbers(value),
            mask = this.getMask(),
            translation = this.getDefaultTranslation();
        return this.toPattern(cleanedValue, mask, translation);
    }
    validate(value) {
        let valueToValidate = this.getValue(value),
            mask = this.getMask();
        return valueToValidate.length === mask.length;
    }
    getMask() {
        if (this.type === MASK_TYPES.CELL_PHONE)
            return CELL_PHONE_MASK;
        else if (this.type === MASK_TYPES.CREDIT_CARD)
            return CREDIT_CARD_MASK;
        else if (this.type === MASK_TYPES.CUSTOM && this.mask !== undefined)
            return this.mask;
    }
    removeNotNumbers(value) {
        return value.replace(/[^0-9]+/g, '');
    }
    getDefaultTranslation() {
        return {
            '9': function (val) {
                return val.replace(/[^0-9]+/g, '')
            },
            A: function (val) {
                return val.replace(/[^a-zA-Z]+/g, '')
            },
            S: function (val) {
                return val.replace(/[^a-zA-Z0-9]+/g, '')
            },
            '*': function (val) {
                return val
            }
        }
    }
    toPattern(value, mask, translation) {
        let result = '';

        let maskCharIndex = 0;
        let valueCharIndex = 0;
    
        while (true) {
            // if mask is ended, break.
            if (maskCharIndex === mask.length) {
                break;
            }

            // if value is ended, break.
            if (valueCharIndex === value.length) {
                break;
            }

            let maskChar = mask[maskCharIndex];
            let valueChar = value[valueCharIndex];

            // value equals mask, just set
            if (maskChar === valueChar) {
                result += maskChar;
                valueCharIndex += 1;
                maskCharIndex += 1;
                continue;
            }
            
            // apply translator if match
            const translationHandler = translation[maskChar];

            if (translationHandler) {
                const resolverValue = translationHandler(valueChar || '');
                if (resolverValue === '') {
                    //valueChar replaced so don't add it to result, keep the mask at the same point and continue to next value char
                    valueCharIndex += 1;
                    continue;
                } else if (resolverValue !== null) {
                    result += resolverValue;
                    valueCharIndex += 1;
                } else {
                    result += maskChar;
                }
                maskCharIndex += 1
                continue;
            }

            // not masked value, fixed char on mask
            result += maskChar;
            maskCharIndex += 1;
            continue; 
        }
        return result;
    }
}

export default MaskHelper;