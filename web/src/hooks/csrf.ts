import type { Handle } from '@sveltejs/kit';
import { json, text } from '@sveltejs/kit';

/**
 * Helper function to determine if request content-type indicates a form submission
 */
function isFormContentType(request: Request) {
	const type = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() ?? '';
	return ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'].includes(type);
}

/**
 * Custom CSRF Protection Middleware
 *
 * @param allowedPaths - List of URL paths that bypass CSRF protection.
 * @param allowedOrigins - Trusted origins allowed to make cross-origin form submissions.
 */
export function csrf(allowedPaths: Array<string>, allowedOrigins: Array<string> = []): Handle {
	return async ({ event, resolve }) => {
		const { request, url } = event;

		const requestOrigin = request.headers.get('origin');
		const isSameOrigin = requestOrigin === url.origin;
		const isAllowedOrigin = allowedOrigins.includes(requestOrigin ?? '');

		const forbidden =
			isFormContentType(request) && // Checks if the request contains form data
			['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) && // State-changing methods
			!isSameOrigin && // Origin mismatch
			!isAllowedOrigin && // Not explicitly allowed
			!allowedPaths.includes(url.pathname); // Path not explicitly allowed

		// If forbidden, return a 403 Forbidden response immediately
		if (forbidden) {
			const message = `Cross-site ${request.method} form submissions are forbidden`;

			// Return JSON or plain text based on request headers
			if (request.headers.get('accept') === 'application/json') {
				return json({ message }, { status: 403 });
			}
			return text(message, { status: 403 });
		}

		// If the request passes CSRF checks, continue to the next middleware or endpoint
		return resolve(event);
	};
}
