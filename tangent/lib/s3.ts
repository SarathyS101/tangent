import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Generate a signed URL for uploading a file to S3
export const generateUploadURL = async (key: string, contentType: string) => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
            ContentType: contentType,
        });
        return await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 minutes
    } catch (error) {
        console.error("💥 Error generating S3 signed upload URL:", error);
        throw error;
    }
};

// Generate a signed URL for downloading a file from S3
export const getSignedUrlForPDF = async (key: string) => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
        });
        return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
    } catch (error) {
        console.error("💥 Error generating S3 signed download URL:", error);
        throw error;
    }
};
