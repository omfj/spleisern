import { error, json, type RequestHandler } from '@sveltejs/kit';
import { responseFormatFromZodObject } from '@mistralai/mistralai/extra/structChat.js';
import { z } from 'zod';
import { title } from '$lib/strings';

const SUPPORTED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

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

	const fileArrayBuffer = await file.arrayBuffer();
	const fileBase64 = Buffer.from(fileArrayBuffer).toString('base64');

	const ocrResponse = await locals.mistral.ocr.process({
		model: 'mistral-ocr-latest',
		document: {
			type: 'document_url',
			documentUrl: `data:${fileType};base64,${fileBase64}`
		},
		documentAnnotationFormat: responseFormatFromZodObject(ReceiptSchema),
		includeImageBase64: true
	});

	if (!ocrResponse || !ocrResponse.documentAnnotation) {
		throw error(500, 'OCR processing failed');
	}

	const data = ReceiptSchema.parse(JSON.parse(ocrResponse.documentAnnotation));
	const titledProducts = data.products.map((product) => ({
		...product,
		name: title(product.name)
	}));

	return json(titledProducts);
};
