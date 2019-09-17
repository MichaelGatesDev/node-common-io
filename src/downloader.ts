import fs from "fs";
import https from "https";

export class WebDownloader {
    private url: string;
    private destination: string;

    public constructor(url: string, destination: string) {
        this.url = url;
        this.destination = destination;
    }

    public async download(): Promise<boolean> {
        const temporaryDestination = `${this.destination}.download`;
        const stream = fs.createWriteStream(temporaryDestination);
        let result = false;

        const request = https.get(this.url, (response): void => {
            const writeStream = response.pipe(stream);
            writeStream.on("finish", (): void => {
                fs.rename(temporaryDestination, this.destination, (err): void => {
                    if (err) {
                        fs.unlink(temporaryDestination, (err): void => {
                            if (err) {
                                throw new Error(`Failed to delete temporary file ${temporaryDestination}`);
                            }
                            result = true;
                        });
                        throw new Error(`Failed to rename downloaded file ${temporaryDestination} => ${this.destination}`);
                    }
                });
            });
        });
        request.on("error", (err): void => {
            console.error((err).toString());
        });
        return result;
    }
}
