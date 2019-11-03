import { WebDownloader } from "../downloader";
import { FileUtils } from "../file-utils";

test("should download a file asynchronously", async () => {
    const url = "https://pastebin.com/raw/U6Sxm38k";
    const dest = "__TEMP.txt";
    expect(await FileUtils.checkExists(dest)).toBe(false);
    const downloader = new WebDownloader(url, dest);
    try {
        await downloader.download();
        expect(await FileUtils.checkExists(dest)).toBe(true);
    } catch (error) {
        expect(await FileUtils.checkExists(dest)).toBe(false);
    } finally {
        await FileUtils.delete(dest);
    }
});
