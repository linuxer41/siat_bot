import Jimp from 'jimp';
import fs from 'fs';
import request from 'request';
var _download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){    
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// downlyad asynchronously version

export async function download(url: string, path: string) {
    return new Promise((resolve, reject) => {
        _download(url, path, () => {
            resolve(path);
        });
    });
}

// async sleep(ms: number)
export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function prepareImage(file: string, change: 'background' | 'foreground' = 'background') {
    return new Promise((resolve, reject) => {
        Jimp.read(file, (err, image) => {
            if (err) {
                reject(err);
            }
            switch (change) {
                case 'background':
                    image.background(0xFFFFFF)
                    break;
            
                default:
                    image.brightness(-.45).contrast(1);
                    break;
            }
            
            image.write(file, () => {
                resolve(file);
            });
        });
    });
}
