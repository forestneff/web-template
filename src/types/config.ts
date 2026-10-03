import { z } from 'zod';
import {
  themeSchema,
  metaSchema,
  brandSchema,
  heroSchema,
  offeringItemSchema,
  offeringsSchema,
  aboutMetricSchema,
  aboutSchema,
  socialProofItemSchema,
  socialProofSchema,
  contactSchema,
  clientConfigSchema,
} from '../config/schema';

export type ThemeConfig = z.infer<typeof themeSchema>;
export type MetaConfig = z.infer<typeof metaSchema>;
export type BrandConfig = z.infer<typeof brandSchema>;
export type HeroConfig = z.infer<typeof heroSchema>;
export type OfferingItem = z.infer<typeof offeringItemSchema>;
export type OfferingsConfig = z.infer<typeof offeringsSchema>;
export type AboutMetric = z.infer<typeof aboutMetricSchema>;
export type AboutConfig = z.infer<typeof aboutSchema>;
export type SocialProofItem = z.infer<typeof socialProofItemSchema>;
export type SocialProofConfig = z.infer<typeof socialProofSchema>;
export type ContactConfig = z.infer<typeof contactSchema>;

export type ClientConfig = z.infer<typeof clientConfigSchema>;

export interface SectionProps<T> {
  data: T;
  className?: string;
}
