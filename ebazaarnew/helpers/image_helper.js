import * as ImageManipulator from "expo-image-manipulator";

class ImageHelper {
    static resizeImage(width, height, maxWith, maxHeight) {
        let ratio = 0;
        if (width > maxWith) {
            ratio = maxWith / width;
            width = width * ratio;
            height = height * ratio;
        } 
        if (height > maxHeight) {
            ratio = maxHeight / height;
            width = width * ratio;
            height = height * ratio;
        }
        return {
            w: width,
            h: height
        };
    }
    static cropImage(image) {
        return new Promise(async (resolve, reject) => {
            const {w, h} = ImageHelper.resizeImage(image.width, image.height, 100, 100);
            const res = await ImageManipulator.manipulateAsync(
                image.uri,
                [{ resize: { width: w, height: h } }],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
            );
            resolve(res);
        });
    }
}

export default ImageHelper;