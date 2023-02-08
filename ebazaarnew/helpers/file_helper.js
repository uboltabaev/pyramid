import { FileSystem } from 'react-native-unimodules';
import _ from 'underscore';

class FileHelper {
    static async getFileBase64(uri, file = null) {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64
            });
            if (_.isNull(file))
                return base64;
            else 
                return {file, base64};
        } catch(e) {
            console.log(e);
        }
    }
    static getFileNameExt(filename) {
        const lastDot = filename.lastIndexOf('.'),
            fileName = filename.substring(0, lastDot),
            ext = filename.substring(lastDot + 1);
        return {
            fileName,
            ext
        };
    }
    static getImageStorage200x200(imageStorageUri) {
        if (_.isString(imageStorageUri)) {
            const {fileName, ext} = FileHelper.getFileNameExt(imageStorageUri),
                str = [
                    fileName,
                    '_200x200',
                    '.',
                    ext
                ];
            return str.join('');    
        }
        return imageStorageUri;
    }
    static getImageStorage400x400(imageStorageUri) {
        if (_.isString(imageStorageUri)) {
            const {fileName, ext} = FileHelper.getFileNameExt(imageStorageUri),
                str = [
                    fileName,
                    '_400x400',
                    '.',
                    ext
                ];
            return str.join('');    
        }
        return imageStorageUri;
    }
    static getImageStorage800x800(imageStorageUri) {
        if (_.isString(imageStorageUri)) {
            const {fileName, ext} = FileHelper.getFileNameExt(imageStorageUri),
                str = [
                    fileName,
                    '_800x800',
                    '.',
                    ext
                ];
            return str.join('');    
        }
        return imageStorageUri;
    }
}

export default FileHelper;