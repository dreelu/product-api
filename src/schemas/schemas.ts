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
  id: z.string().describe('the user identifier, as userId.'),
  name: z.string().describe('the user identifier, as name.')
})

