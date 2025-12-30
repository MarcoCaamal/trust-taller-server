import type { RequestHandler } from "express";
import { z, ZodError, type ZodTypeAny } from "zod";

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
  headers?: ZodTypeAny;
}

export const validate = (schemas: ValidationSchemas): RequestHandler => {
  // Armamos el schema solo con las secciones que nos pasaron
  const schema = z.object({
    ...(schemas.body ? { body: schemas.body } : {}),
    ...(schemas.query ? { query: schemas.query } : {}),
    ...(schemas.params ? { params: schemas.params } : {}),
    ...(schemas.headers ? { headers: schemas.headers } : {}),
  });

  return async (req, res, next) => {
    // Armamos el input solo con lo que vamos a validar
    const input: Record<string, unknown> = {};
    if (schemas.body) input.body = req.body;
    if (schemas.query) input.query = req.query;
    if (schemas.params) input.params = req.params;
    if (schemas.headers) input.headers = req.headers;

    const parsed = await schema.safeParseAsync(input);

    if (!parsed.success) return next(parsed.error);

    // Opcional: sincronizar req.* (yo haría esto solo para body/query/params)
    if ("body" in parsed.data) req.body = parsed.data.body;
    if ("query" in parsed.data) req.query = parsed.data.query as any;
    if ("params" in parsed.data) req.params = parsed.data.params as any;

    // Recomendado: headers validados en locals, no mutar req.headers
    if ("headers" in parsed.data) {
      res.locals.validatedHeaders = parsed.data.headers;
    }

    // También puedes guardar TODO lo validado:
    res.locals.validated = parsed.data;

    return next();
  };
};
