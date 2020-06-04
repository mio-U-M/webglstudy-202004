import { IMG_DIR } from "../../constants.yml";
import * as THREE from "three";

// ひとまずobjectでくる想定
export function threeTextureLoad(textures) {
    const texturePromises = [];
    const loadedTextures = {};
    const loader = new THREE.TextureLoader();

    for (var key in textures) {
        texturePromises.push(
            new Promise((resolve, reject) => {
                const entry = textures[key];
                const url = `${IMG_DIR}/${entry}`;
                loader.load(
                    url,
                    texture => {
                        loadedTextures[key] = texture;
                        if (texture instanceof THREE.Texture) resolve();
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
