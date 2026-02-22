import z, { email, regexes } from 'zod';

export const ProductsResponseSchema = z.object({
    id: z.string().regex(regexes.uuid()),
    name: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number(),
})

export const ProductsListResponse = z.array(ProductsResponseSchema)

export const ErrorSchema = z.object({
  message: z.string(),
})

export const NotFoudSchema = z.object({
  message: z.literal("Not found."),
})

const ZodIssueSchema = z.object({
  keyword: z.string(),
  instancePath: z.string(),
  schemaPath: z.string(),
  message: z.string(),
  params: z.record(z.string(), z.unknown())
})

export const ZodTypeErrorSchema = z.object({
  error: z.literal("Response Validation Error",),
  message: z.literal("Request doesn't match the schema"),
  statusCode: z.literal(400),
  details: z.object({
    issues: z.array(ZodIssueSchema),
    method: z.enum(['POST', 'GET', 'PUT', 'DELETE']),
    url: z.string()
  })
})


export const BodySchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
})

export const HeaderSchema = z.object({
  authorization: z.string().optional()
})

export const ParamsSchema = z.object({
  id: z.string().regex(z.regexes.uuid()).describe('the product identifier, as ID.')
})

export const querySchema = z.object({
  id: z.string().regex(z.regexes.uuid()).optional(),
  name: z.string().optional(),
}).refine(
  (v) => !(v.id && v.name),
  { message: 'Use only id or name, not both at the same time.' }
)

// Auth Schemas

/// Register

export const RegisterBodySchema = z.object({
  email: z.email().nonoptional(),
  name: z.string().min(3),
  password: z.string().min(5),
})

export const AuthResponseSchema = z.object({
  message: z.string().min(1).optional(),
  token: z.string().nonoptional()
})

/// Login

export const LoginBodySchema = z.object({
  email: z.email().nonoptional(),
  password: z.string().nonoptional()

})
