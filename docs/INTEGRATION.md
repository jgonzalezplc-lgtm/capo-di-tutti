# Contrato inicial Capo ↔ Baiyer

Capo consume datos; Baiyer conserva la autoridad sobre el negocio.

## Identidad multiempresa

Todo evento debe incluir `user_id` y `organization_id`. Una cuenta individual también es una organización con un solo miembro. La pertenencia se resuelve mediante `organization_memberships`, no comparando el texto `empresa` del metadata.

## Ledger de producto

Eventos append-only con: `event_id`, `occurred_at`, `organization_id`, `user_id`, `event_type`, `entity_type`, `entity_id`, `correlation_id`, `status` y metadata JSON sanitizada.

## Ledger de IA

Una fila por intento de proveedor: funcionalidad, proveedor, modelo solicitado/efectivo, fallback, tokens, latencia, costo estimado, estado, error sanitizado y correlación con el evento de producto.

## Seguridad

Capo usará un backend administrativo server-only. La autorización exige email incluido en `CAPO_ADMIN_EMAILS` y, posteriormente, una fila activa en `admin_users`. No habrá consultas con service role desde Client Components.
