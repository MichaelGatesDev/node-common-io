import fs from "fs";
import https from "https";

export class WebDownloader {
    private url: string;
    private destination: string;

    public constructor(url: string, destination: string) {
        this.url = url;
        this.destination = destination;
    }

    public async download(): Promise<void> {
        const temporaryDestination = `${this.destination}.download`;
        const stream = fs.createWriteStream(temporaryDestination);

        return new Promise((resolve, reject): void => {
            const request = https.get(this.url, (res): void => {
                // redirected
                if (res.statusCode !== undefined && res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
                    https.get(res.headers.location, (redirectRes) => {
                        const writeStream = redirectRes.pipe(stream);
                        writeStream.on("finish", async (): Promise<void> => {
                            try {
                                await fs.promises.rename(temporaryDestination, this.destination);
                                return resolve();
                            } catch (error) {
                                return reject(new Error(`Failed to rename downloaded file ${temporaryDestination} => ${this.destination}`));
                            }
                        });
                    });
                } else {
                    const writeStream = res.pipe(stream);
                    writeStream.on("finish", async (): Promise<void> => {
                        try {
                            await fs.promises.rename(temporaryDestination, this.destination);
                            return resolve();
                        } catch (error) {
                            return reject(new Error(`Failed to rename downloaded file ${temporaryDestination} => ${this.destination}`));
                        }
                    });
                }
            });
            request.on("error", (err): void => {
                return reject(err);
            });
        });
    }

}
