import { FileUtils } from "../file-utils";

const dirPath = "_my_cool_directory_";
test("should create a directory", async () => {
    // create dir
    const createRes = await FileUtils.createDirectory(dirPath);
    expect(() => { createRes }).not.toThrow();
});
test("should check if directory is empty", async () => {
    // check empty dir
    const emptyRes: boolean = await FileUtils.isDirectoryEmpty(dirPath);
    expect(emptyRes).toBe(true);
});
test("should copy the directory", async () => {
    // copy directory
    const copyRes = await FileUtils.copy(dirPath, `${dirPath}-copy`);
    expect(() => { copyRes }).not.toThrow();
});
test("should delete the copied directory", async () => {
    // delete json
    const delRes = await FileUtils.delete(`${dirPath}-copy`);
    expect(() => { delRes }).not.toThrow();
});
test("should delete a directory", async () => {
    // delete dir
    const delRes = await FileUtils.delete(dirPath);
    expect(() => { delRes }).not.toThrow();
});

interface ExampleInterface {
    name: string;
    description: string;
}

const jsonPath = "_test.json";
test("should write a json file", async () => {
    // write json
    const writeRes = await FileUtils.writeJSON(jsonPath, { name: "test", description: "hello world" });
    expect(() => { writeRes }).not.toThrow();
});
test("should read the json file", async () => {
    // read json
    const writeRes: ExampleInterface | undefined = await FileUtils.readJSON<ExampleInterface>(jsonPath);
    expect(writeRes).toBeDefined();
});
test("should copy the json file", async () => {
    // read json
    const copyRes = await FileUtils.copy(jsonPath, `${jsonPath}.copy`);
    expect(() => { copyRes }).not.toThrow();
});
test("should rename the copied json file", async () => {
    const renameRes = await FileUtils.rename(`${jsonPath}.copy`, `${jsonPath}.copy.renamed`);
    expect(() => { renameRes }).not.toThrow();
});
test("should delete the copied json file", async () => {
    // delete json
    const delRes = await FileUtils.delete(`${jsonPath}.copy.renamed`);
    expect(() => { delRes }).not.toThrow();
});
test("should delete the json file", async () => {
    // delete json
    const delRes = await FileUtils.delete(jsonPath);
    expect(() => { delRes }).not.toThrow();
});

test("should check the size of a directory", async () => {
    await FileUtils.createDirectory(dirPath);
    await FileUtils.writeJSON(`${dirPath}/temp.json`, { name: "bob", age: 21 });
    const listRes = await FileUtils.list(dirPath);
    await FileUtils.delete(dirPath);
    expect(listRes.length).toBe(1);
});


test("should search a directory recursively for filtered files", async () => {
    await FileUtils.createDirectory(dirPath);
    await FileUtils.writeJSON(`${dirPath}/temp.json`, {});
    await FileUtils.writeJSON(`${dirPath}/temp3.jsonc`, {});
    await FileUtils.writeJSON(`${dirPath}/temp2.jsonx`, {});
    await FileUtils.writeJSON(`${dirPath}/temp4.jsond`, {});

    const found = await FileUtils.findInDirectory(dirPath, /(\.json|\.jsonc)$/);
    expect(found.length).toBe(2);

    const delRes = await FileUtils.delete(dirPath);
    expect(() => { delRes }).not.toThrow();
})
