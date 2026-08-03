# Capo di Tutti

Control plane privado de Baiyer. La Fase 1 entrega observabilidad de solo lectura para organizaciones, usuarios, actividad de producto y consumo de modelos.

## Desarrollo

```bash
cp .env.example .env.local
npm install
npm run dev
```

Mantén `CAPO_DEMO_MODE=true` durante el diseño. Cuando sea `false`, el acceso se autentica contra Supabase Auth, valida `CAPO_ADMIN_EMAILS` y la aplicación falla de forma segura si no existe una conexión administrativa configurada.

## Límites de seguridad

- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al navegador.
- Toda consulta real se ejecutará en Server Components, Route Handlers o la futura API administrativa.
- Capo no modifica datos de Baiyer durante la Fase 1.
- Las acciones futuras deberán registrar actor, motivo, entidad y valores anterior/nuevo en un audit log inmutable.

## Integración pendiente con Baiyer

1. Aplicar el modelo de organizaciones y membresías.
2. Crear `product_events` y `ai_usage_events` como ledgers append-only.
3. Instrumentar los wrappers de Gemini, Serper y correo.
4. Exponer vistas/RPC administrativas protegidas.
5. Reemplazar el repositorio demo sin cambiar los componentes visuales.
