import { z } from 'zod';

export const themeSchema = z.object({
  primaryColor: z.string().min(1, 'Primary color is required'),
  accentColor: z.string().min(1, 'Accent color is required'),
  bgColor: z.string().optional().default('#0f172a'),
  textColor: z.string().optional().default('#f8fafc'),
});

export const metaSchema = z.object({
  siteTitle: z.string().min(1, 'Site title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  theme: themeSchema,
});

export const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  logoUrl: z.string().optional(),
  tagline: z.string().min(1, 'Tagline is required'),
});

export const heroSchema = z.object({
  headline: z.string().min(1, 'Hero headline is required'),
  subheadline: z.string().min(1, 'Hero subheadline is required'),
  ctaText: z.string().min(1, 'CTA text is required'),
  ctaUrl: z.string().min(1, 'CTA URL is required'),
  mediaUrl: z.string().optional(),
});

export const offeringItemSchema = z.object({
  title: z.string().min(1, 'Offering title is required'),
  description: z.string().min(1, 'Offering description is required'),
  icon: z.string().min(1, 'Icon name is required'),
});

export const offeringsSchema = z.array(offeringItemSchema);

export const aboutMetricSchema = z.object({
  label: z.string().min(1, 'Metric label is required'),
  value: z.string().min(1, 'Metric value is required'),
});

export const aboutSchema = z.object({
  headline: z.string().min(1, 'About headline is required'),
  bio: z.string().min(1, 'About bio is required'),
  avatarUrl: z.string().optional(),
  metrics: z.array(aboutMetricSchema).optional(),
});

export const socialProofItemSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  author: z.string().min(1, 'Author is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().optional(),
});

export const socialProofSchema = z.array(socialProofItemSchema);

export const contactSchema = z.object({
  type: z.enum(['calendar', 'email', 'form']),
  calendarEmbedUrl: z.string().optional(),
  directEmail: z.string().email('Valid email required').optional().or(z.literal('')),
  socialLinks: z.record(z.string(), z.string()).optional(),
});

export const clientConfigSchema = z.object({
  meta: metaSchema,
  brand: brandSchema,
  hero: heroSchema,
  offerings: offeringsSchema,
  about: aboutSchema.optional(),
  socialProof: socialProofSchema.optional(),
  contact: contactSchema.optional(),
});

export type ClientConfigInput = z.input<typeof clientConfigSchema>;
export type ClientConfigOutput = z.infer<typeof clientConfigSchema>;
