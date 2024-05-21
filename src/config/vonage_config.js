import {Vonage} from '@vonage/server-sdk'

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
});

export default vonage;
