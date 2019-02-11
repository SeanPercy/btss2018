// @ts-ignore
import fs from "fs";
// @ts-ignore
import path from "path";

function deleteFolderRecursive(dir: string): void {
    if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
        fs.readdirSync(dir).forEach((file, _) => {
            const curPath = `${dir}/${file}`;

            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });

        process.stdout.write(`Deleting directory "${dir}"...\n`);
        fs.rmdirSync(dir);
    }
}

process.stdout.write("Cleaning cache...\n");

deleteFolderRecursive(path.resolve(__dirname, "../cache"));

process.stdout.write("Successfully cleaned working tree!\n");
