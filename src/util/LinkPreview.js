import sharp from 'sharp';
import { getLinkPreview } from 'link-preview-js';
import axios from 'axios';
import stream from 'stream';
const THUMBNAIL_WIDTH_PX = 192;


const toBuffer = async (str) => {
    const chunks = [];
    for await (const chunk of str) {
        chunks.push(chunk);
    }
    str.destroy();
    return Buffer.concat(chunks);
};

async function getHttpStream(url, options = {}) {
    const fetched = await axios.get(url.toString(), { ...options, responseType: 'stream' });
    return fetched.data;
}

async function extractImageThumb(bufferOrFilePath, width = 32) {
    if (bufferOrFilePath instanceof stream.Readable) {
        bufferOrFilePath = await toBuffer(bufferOrFilePath)
    }

    const img = sharp(bufferOrFilePath)
    const dimensions = await img.metadata();
    const buffer = await img
        .resize(width)
        .jpeg({ quality: 50 })
        .toBuffer();
    return {
        buffer,
        original: {
            width: dimensions.width,
            height: dimensions.height,
        },
    };
}

const getCompressedJpegThumbnail = async (url, { thumbnailWidth, fetchOpts }) => {
    const buffer = await getHttpStream(url, fetchOpts);
    const result = await extractImageThumb(buffer, thumbnailWidth);
    return result;
}

export const getUrlInfo = async (text, opts = {
    thumbnailWidth: THUMBNAIL_WIDTH_PX,
    fetchOpts: { timeout: 3000 }
}) => {
    try {
        // retries
        const retries = 0;
        const maxRetry = 5;
        let previewLink = text;
        if (!text.startsWith('https://') && !text.startsWith('http://')) {
            previewLink = 'https://' + previewLink;
        }
        const info = await getLinkPreview(previewLink, {
            ...opts.fetchOpts,
            followRedirects: 'manual',
            handleRedirects: (baseURL, forwardedURL) => {
                const urlObj = new URL(baseURL);
                const forwardedURLObj = new URL(forwardedURL);
                if (retries >= maxRetry) {
                    return false;
                }
                if (forwardedURLObj.hostname === urlObj.hostname
                    || forwardedURLObj.hostname === 'www.' + urlObj.hostname
                    || 'www.' + forwardedURLObj.hostname === urlObj.hostname) {
                    retries + 1;
                    return true;
                }
                else {
                    return false;
                }
            },
            headers: opts.fetchOpts
        })

        const [image] = info.images;

        const linkPreview = {
            title: info.title,
            description: info.description,
            canonicalUrl: info.url,
            matchedText: text,
            richPreviewType: 0,
            thumbnail: (await getCompressedJpegThumbnail(image, opts)).buffer.toString('base64')
        }

        return linkPreview
    } catch (error) {
        if (!error.message.includes('receive a valid')) {
            throw error;
        }
    }
}