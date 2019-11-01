import { StringUtils } from "@michaelgatesdev/common";

import { WebDownloader } from "./downloader";
import { FileUtils } from "./file-utils";

export class GoogleDriveDownloader {

    public static BASE_URL = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}";
    // private static SHEET_URL: string = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}&gid={sheetID}";

    public static async downloadSpreadsheet(docID: string, format = "xlsx", destination: string, forceReplace = true): Promise<boolean> {
        if (StringUtils.isBlank(docID)) {
            throw new Error("The docID of the spreadsheet must be specified");
        }
        if (StringUtils.isBlank(format)) {
            throw new Error("The format of the download must be specified");
        }
        if (StringUtils.isBlank(destination)) {
            throw new Error("The destination of the spreadsheet must be specified");
        }

        if (await FileUtils.checkExists(destination) && !forceReplace) { throw new Error("There is already a file at that location."); }

        const downloadURL = GoogleDriveDownloader.BASE_URL
            .replace("{docID}", docID)
            .replace("{format}", format);

        const downloader = new WebDownloader(
            downloadURL,
            destination,
        );

        try {
            await downloader.download();
            return true;
        } catch (error) {
            throw error;
        }
    }

}
