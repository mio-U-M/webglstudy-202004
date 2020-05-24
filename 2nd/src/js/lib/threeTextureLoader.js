import { IMG_DIR } from "../constants.yml";

// ひとまずobjectでくる想定
export function threeTextureLoad(textures) {
    const texturePromises = [];
    const loadedTextures = {};

    for (var key in textures) {
        texturePromises.push(
            new Promise((resolve, reject) => {
                const entry = textures[key];
                const url = IMG_DIR + entry.url;
                loader.load(
                    url,
                    texture => {
                        loadedTextures[key] = texture;
                        if (entry.val instanceof THREE.Texture) resolve(entry);
                    },
                    xhr => {
                        console.log(
                            url +
                                " " +
                                (xhr.loaded / xhr.total) * 100 +
                                "% loaded"
                        );
                    },
                    xhr => {
                        reject(
                            new Error(
                                xhr +
                                    "An error occurred loading while loading: " +
                                    entry.url
                            )
                        );
                    }
                );
            })
        );
    }

    return Promise.all(texturePromises).then(() => {
        return loadedTextures;
    });
}
