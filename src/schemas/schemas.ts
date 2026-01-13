import z from 'zod';

export const ProductsResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number(),
})

export const ProductsListResponse = z.array(ProductsResponseSchema)

export const ErrorSchema = z.object({
  message: z.string()
})

export const BodySchema = z.object({
  name: z.string(),
  price: z.coerce.number().min(0),
  stock: z.number().int().min(0),
})

export const ParamsSchema = z.object({
  id: z.string().describe('the product identifier, as ID.'),
  name: z.string().describe('the product identifier, as name.')
})

export const querySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
}).refine(
  (v) => !(v.id && v.name),
  { message: 'Use only id or name, not both at the same time.' }
)

