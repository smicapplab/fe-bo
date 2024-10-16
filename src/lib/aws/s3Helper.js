import { PRI_AWS_SECRET_KEY, PRI_AWS_ACCESS_KEY } from '$env/static/private';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

let credentials = {};
if (PRI_AWS_ACCESS_KEY && PRI_AWS_SECRET_KEY) {
	credentials = {
		credentials: {
			accessKeyId: PRI_AWS_ACCESS_KEY,
			secretAccessKey: PRI_AWS_SECRET_KEY
		}
	};
}

const s3Client = new S3Client({
	region: 'ap-southeast-1',
	...credentials
});


/**
 * Description placeholder
 *
 * @param {*} base64String
 * @returns {*}
 */
const decodeBase64 = (base64String) => {
	const base64Data = base64String.replace(/^data:([A-Za-z-+/]+);base64,/, '');
	return Buffer.from(base64Data, 'base64');
};


// @ts-ignore
export const uploadToS3 = async ({ buffer, fileName, bucket, fileType = "pdf" }) => {
	try {
		const checkUpload = new Upload({
			client: s3Client,
			params: {
				Bucket: bucket,
				Key: fileName,
                ...( fileType === "pdf" ? {ContentType: 'application/pdf', ContentDisposition: 'inline'} : {} ),
				Body: buffer
			}
		});

		checkUpload.on('httpUploadProgress', (progress) => {
			console.log(progress);
		});

		await checkUpload.done();
	} catch (e) {
		console.error('uploadToS3 ---->', { e });
	}
};

// @ts-ignore
export const uploadBase64File = async ({ base64String, fileName, bucket, fileType }) => {
	const buffer = decodeBase64(base64String);
	await uploadToS3({ buffer, fileName, bucket, fileType });
};

// @ts-ignore
export const resolveFileType = ({ name, data }) => {
	let fileType = "";
	if (name.toLowerCase().endsWith('.pdf')) {
		fileType = 'pdf';
	} else {
		fileType = data.substring('data:'.length, data.indexOf(';base64')).split('/')[1].toLowerCase();
	}	

	return fileType;
}