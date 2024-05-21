class SendSMSServices {
    async send(text, to) {
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": `App ${process.env.API_KEY}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "messages": [{
                    "destinations": [{"to": to}],
                    "from": "Slash | Chat App",
                    "text": text
                }]
            })
        };

        try {
            const response = await fetch(`https://${process.env.API_URL}/sms/2/text/advanced`, requestOptions);
            const result = await response.text();
            return result
        } catch (error) {
            console.error(error);
        }
    }
}

export default new SendSMSServices();
