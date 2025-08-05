import { error, json, type RequestHandler } from '@sveltejs/kit';
import { responseFormatFromZodObject } from '@mistralai/mistralai/extra/structChat.js';
import { z } from 'zod';
import { title } from '$lib/strings';
import type {
	DocumentURLChunk,
	FileChunk,
	ImageURLChunk
} from '@mistralai/mistralai/models/components';

type MistralDocument = FileChunk | ImageURLChunk | DocumentURLChunk;

const SUPPORTED_FILE_TYPES = [
	'application/pdf',
	'image/png',
	'image/jpeg',
	'image/jpg',
	'image/webp',
	'image/avif'
];

const ReceiptSchema = z.object({
	products: z
		.object({
			name: z.string().describe('The name of the product'),
			price: z
				.number()
				.describe('The price of the product. Add the pant to the price if there is one.')
		})
		.array()
		.describe('List of products in the receipt')
});

export type ReceiptOCRResponse = z.infer<typeof ReceiptSchema>;

async function createFileUrl(type: string, file: File): Promise<string> {
	const fileArrayBuffer = await file.arrayBuffer();
	const fileBase64 = Buffer.from(fileArrayBuffer).toString('base64');
	return `data:${type};base64,${fileBase64}`;
}

function createMistralDocument(type: string, url: string): MistralDocument {
	return type === 'application/pdf'
		? {
				type: 'document_url',
				documentUrl: url
			}
		: {
				type: 'image_url',
				imageUrl: url
			};
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const user = locals.auth.user;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const formData = await request.formData();
	const file = formData.get('file') as File;
	if (!file || !(file instanceof File)) {
		throw error(400, 'No file provided');
	}

	const fileType = file.type;
	if (!SUPPORTED_FILE_TYPES.includes(fileType)) {
		throw error(400, `Unsupported file type: ${fileType}`);
	}

	const fileUrl = await createFileUrl(fileType, file);
	const document = createMistralDocument(fileType, fileUrl);

	let ocrResponse;

	try {
		ocrResponse = await locals.mistral.ocr.process({
			model: 'mistral-ocr-latest',
			document,
			documentAnnotationFormat: responseFormatFromZodObject(ReceiptSchema)
		});
	} catch (err) {
		console.error('OCR processing error:', err);
		throw error(500, 'Failed to process OCR');
	}

	if (!ocrResponse || !ocrResponse.documentAnnotation) {
		console.error('OCR response is invalid:', ocrResponse);
		throw error(500, 'OCR processing failed');
	}

	const data = ReceiptSchema.parse(JSON.parse(ocrResponse.documentAnnotation));
	const titledProducts = data.products.map((product) => ({
		...product,
		name: title(product.name)
	}));

	return json(titledProducts);
};
