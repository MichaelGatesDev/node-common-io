import { promises as fsPromises } from "fs";
import * as fse from "fs-extra";
import rimraf from "rimraf";
import path from "path";

export enum FileType {
    File,
    Directory,
    Other,
    Invalid,
}

export interface SimpleFile {
    type?: FileType;
    path: string;
}

export class FileUtils {

    public static async createDirectory(path: string, recursive?: boolean): Promise<void> {
        const exists: boolean = await this.checkExists(path);
        if (exists) { throw new Error(`A directory at that path already exists (${path})`); }
        await fsPromises.mkdir(path, { recursive });
    }

    public static async checkExists(path: string): Promise<boolean> {
        return await fse.pathExists(path);
    }

    public static async isDirectory(path: string): Promise<boolean> {
        try {
            const stat = await fsPromises.stat(path);
            return stat.isDirectory();
        } catch (error) {
            return false;
        }
    }

    public static async isDirectoryEmpty(path: string): Promise<boolean> {
        try {
            if (!await this.isDirectory(path)) { return false; }
            const files = await fsPromises.readdir(path);
            return files.length === 0;
        } catch (error) {
            return false;
        }
    }

    public static async isFile(path: string): Promise<boolean> {
        try {
            const stat = await fsPromises.stat(path);
            return stat.isFile();
        } catch (error) {
            return false;
        }
    }

    public static async delete(path: string): Promise<void> {
        return new Promise<void>(async (resolve, reject): Promise<void> => {
            try {
                if (await this.isDirectory(path)) {
                    rimraf(path, (err) => {
                        if (err) {
                            return reject(false);
                        }
                        return resolve();
                    });
                } else if (await this.isFile(path)) {
                    await fsPromises.unlink(path);
                    return resolve();
                }
            } catch (error) {
                return reject(false);
            }
        });
    }

    public static async writeJSON(path: string, content: any, replacer?: ((this: any, key: string, value: any) => any) | undefined): Promise<void> {
        await fsPromises.writeFile(path, JSON.stringify(content, replacer, 4));
    }

    public static async readJSON<T>(path: string): Promise<T | undefined> {
        try {
            const buffer: string = await fsPromises.readFile(path, "utf-8");
            const json = JSON.parse(buffer);
            return json as T;
        } catch (error) {
            return undefined;
        }
    }

    public static async copy(path: string, destination: string): Promise<void> {
        await fse.copy(path, destination);
    }

    public static async list(path: string): Promise<SimpleFile[]> {
        try {
            const result: SimpleFile[] = [];
            const files = await fse.readdir(path);
            for (const file of files) {
                result.push({
                    path: file,
                    type: this.isFile(file) ? FileType.File : this.isDirectory(file) ? FileType.Directory : FileType.Other,
                });
            }
            return result;
        } catch (error) {
            return [];
        }
    }

    public static async rename(oldPath: string, newPath: string): Promise<void> {
        await fsPromises.rename(oldPath, newPath);
    }

    public static async findInDirectory(dir: string, filter: RegExp, fileList: string[] = []): Promise<string[]> {
        try {
            const files = await fsPromises.readdir(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);

                const fileStat = await fsPromises.lstat(filePath);

                if (fileStat.isDirectory()) {
                    FileUtils.findInDirectory(filePath, filter, fileList);
                } else if (filter.test(filePath)) {
                    fileList.push(filePath);
                }
            }

            return fileList;
        } catch (error) {
            return [];
        }
    }
}
