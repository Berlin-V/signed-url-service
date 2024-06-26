import { Storage, type GetSignedUrlConfig } from "@google-cloud/storage";
import { errorLog, log } from "./utils/logger";

//environment variables
const { GS_STORAGE_PROJECT_ID: projectId, STORAGE_BUCKET: bucketName } =
    Bun.env;

if (!projectId || !bucketName)
    throw new Error("Missing signed url environment variables");

const storage: Storage = new Storage({ projectId });

export async function getSignedUrl(fileName: string): Promise<{
    status: string;
    message: string;
    data?: {
        url: string;
        expiryDate: number;
    };
}> {
    try {
        log(`Request received for get signed url for the file id ${fileName}`);

        if (!fileName)
            throw new Error("input validation failed, missing fileId");

        const destinationFileName = fileName;
        const expiryDate = Date.now() + 15 * 60 * 1000; // 15 minutes.

        const options = {
            version: "v4",
            action: "read",
            expires: expiryDate,
        } as GetSignedUrlConfig;

        const fileRef = storage
            .bucket(bucketName as string)
            .file(destinationFileName);

        // Check if the file exist
        const [exists] = await fileRef.exists();
        if (!exists)
            throw new Error(
                `Given file name [${destinationFileName}] is not present`
            );

        const [url] = await fileRef.getSignedUrl(options);
        log("Created signed url successfully");

        return {
            status: "SUCCESS",
            message: "Get signed url successfully",
            data: { url, expiryDate },
        };
    } catch (err: any) {
        errorLog(`Request failed with the error message, ${err.message}`);

        return {
            status: "ERROR",
            message: err.message,
        };
    }
}
