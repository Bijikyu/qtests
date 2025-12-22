/**
 * Basic Validation Schemas
 * Simple Zod schemas for common data types
 */

import { z } from 'zod';
import { sanitizeString } from './htmlSanitization.js';

export const safeString = z.string().transform(sanitizeString);
export const safeNumber = z.number();
export const safeBoolean = z.boolean();
export const safeArray = z.array(z.any());
export const safeObject = z.object({}).passthrough();

export const shortString = z.string().max(500).transform(sanitizeString);
export const mediumString = z.string().max(5000).transform(sanitizeString);
export const longString = z.string().max(50000).transform(sanitizeString);

export { z };