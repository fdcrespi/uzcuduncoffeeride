-- tables
-- Table: Cliente
CREATE TABLE Cliente (
    id SERIAL PRIMARY KEY ,
    domicilio varchar(150)  NOT NULL,
    telefono bigint  NOT NULL,
    nombre varchar(150)  NOT NULL
);

-- Table: Comercio
CREATE TABLE Comercio (
    id SERIAL PRIMARY KEY,
    razon_social varchar(150)  NOT NULL,
    cuit bigint  NOT NULL,
    nombre_fantasia varchar(150),
    logo varchar(250)
);

-- Table: Estado
CREATE TABLE Estado (
    id SERIAL PRIMARY KEY,
    descripcion varchar(50)  NOT NULL,
    orden int  NOT NULL UNIQUE
);

-- Table: Estado_Pedido
CREATE TABLE Estado_Pedido (
    pedido_id int  NOT NULL,
    estado_id int  NOT NULL,
    usuario_id int  NOT NULL,
    fecha timestamp  NOT NULL,
    PRIMARY KEY (estado_id,pedido_id)
);

-- Table: Modo_Entrega
CREATE TABLE Modo_Entrega (
    id SERIAL PRIMARY KEY,
    descripcion varchar(150)  NOT NULL
);

-- Table: Pedido
CREATE TABLE Pedido (
    id SERIAL PRIMARY KEY,
    fecha_emision timestamp  NOT NULL DEFAULT current_timestamp,
    cliente_id int  NOT NULL DEFAULT 1,
    fecha_finalizacion timestamp  NULL,
    pago boolean  NOT NULL,
    modo_entrega_id int  NOT NULL,
    mp_id bigint  NULL,
    payer_name varchar(50)  NULL,
    payer_address varchar(150)  NULL,
    payer_phone varchar(50)  NULL,
    payer_zip varchar(10)  NULL,
    total float NOT NULL,
    delivery float NOT NULL DEFAULT 0,
    status varchar(50) NOT NULL DEFAULT 'pending'
);

-- Table: Pedido_Productos
CREATE TABLE Pedido_Productos (
    pedido_id int  NOT NULL,
    producto_id int  NOT NULL,
    cantidad int  NOT NULL,
    precio float  NOT NULL,
    PRIMARY KEY (pedido_id, producto_id)
);

-- Table: Producto
CREATE TABLE Producto (
    id SERIAL PRIMARY KEY,
    nombre varchar(50)  NOT NULL,
    descripcion varchar(150)  NULL,
    subrubro_id int  NOT NULL,
    --image varchar(255)  NULL,  (migramos a Producto_Imagen)
    destacado boolean  NOT NULL DEFAULT false,
    visible boolean  NOT NULL DEFAULT true
);

-- Table: Rol
CREATE TABLE Rol (
    id SERIAL PRIMARY KEY,
    descripcion varchar(50)  NOT NULL
);

-- Table: Rubro
CREATE TABLE Rubro (
    id SERIAL PRIMARY KEY,
    nombre varchar(50)  NOT NULL
);

-- Table: Status_Sucursal
CREATE TABLE Status_Sucursal (
    id SERIAL PRIMARY KEY,
    nombre varchar(50)  NOT NULL
);

-- Table: Subrubro
CREATE TABLE Subrubro (
    id SERIAL PRIMARY KEY,
    rubro_id int  NOT NULL,
    nombre varchar(50)  NOT NULL
);

-- Table: Sucursal
CREATE TABLE Sucursal (
    id SERIAL PRIMARY KEY,
    nombre varchar(150)  NOT NULL,
    domicilio_calle varchar(150)  NOT NULL,
    domicilio_nro int  NOT NULL,
    domicilio_piso varchar(50)  NULL,
    domicilio_dpto varchar(50)  NULL,
    telefono int  NOT NULL,
    status_sucursal_id int  NOT NULL,
    comercio_id int  NOT NULL,
    demora int  NOT NULL DEFAULT 30
);

-- Table: Sucursal_Productos
CREATE TABLE Sucursal_Productos (
    producto_id int  NOT NULL,
    sucursal_id int  NOT NULL,
    stock int  NOT NULL DEFAULT 0,
    stock_minimo int  NOT NULL DEFAULT 0,
    precio float  NOT NULL DEFAULT 0,
    PRIMARY KEY (producto_id,sucursal_id)
);

-- Table: Usuario
CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    email varchar(150)  NOT NULL,
    pass varchar(150)  NOT NULL,
    nombre varchar(150)  NULL,
    apellido varchar(150)  NULL,
    rol_id int  NOT NULL DEFAULT 1,
    sucursal_id int  NOT NULL
);

CREATE TABLE IF NOT EXISTS Producto_Imagen (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES Producto(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    is_principal BOOLEAN NOT NULL DEFAULT FALSE,
    orden INT NOT NULL DEFAULT 1,
    peso_mb NUMERIC(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--10/10/2025 agregar logistica basica
-- Tabla de tarifas por código postal
-- 1) Tabla (idempotente)
CREATE TABLE IF NOT EXISTS Logistica_Tarifa_CP (
  id SERIAL PRIMARY KEY,
  cp VARCHAR(10) NOT NULL,                  -- ej: '7600' o '*' (fallback)
  costo NUMERIC(12,2) NOT NULL CHECK (costo >= 0),
  plazo_dias INT NULL CHECK (plazo_dias >= 0),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT uq_logistica_tarifa_cp UNIQUE (cp)
);

-- 2) Función updated_at (idempotente)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) Drop del trigger SOLO si existe (sin NOTICE)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE t.tgname = 'trg_logistica_tarifa_cp_updated'
      AND c.relname = 'logistica_tarifa_cp'
  ) THEN
    EXECUTE 'DROP TRIGGER trg_logistica_tarifa_cp_updated ON Logistica_Tarifa_CP';
  END IF;
END
$$;

-- 4) Crear trigger (idempotente: primero intentar dropear arriba)
CREATE TRIGGER trg_logistica_tarifa_cp_updated
BEFORE UPDATE ON Logistica_Tarifa_CP
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5) Fallback global (idempotente)
INSERT INTO Logistica_Tarifa_CP (cp, costo, plazo_dias, activo) VALUES
  ('7600', 2500, 3, TRUE),   -- Mar del Plata (ejemplo)
  ('1000', 3000, 4, TRUE),   -- CABA (ejemplo)
  ('*',    4000, 5, TRUE)    -- fallback nacional
ON CONFLICT (cp) DO UPDATE
  SET costo = EXCLUDED.costo,
      plazo_dias = EXCLUDED.plazo_dias,
      activo = EXCLUDED.activo;


--FIN logistica basica


-- Índices/constraints
CREATE UNIQUE INDEX IF NOT EXISTS ux_prod_img_principal
ON Producto_Imagen (producto_id)
WHERE is_principal = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS ux_prod_img_orden
ON Producto_Imagen (producto_id, orden);

CREATE INDEX IF NOT EXISTS ix_prod_img_producto
ON Producto_Imagen (producto_id);


-- foreign keys
-- Reference: Estado_Pedido_Estado (table: Estado_Pedido)
ALTER TABLE Estado_Pedido ADD CONSTRAINT fk_EstadoPedido_Estado FOREIGN KEY (estado_id)
    REFERENCES Estado (id);

-- Reference: Estado_Pedido_Pedido (table: Estado_Pedido)
ALTER TABLE Estado_Pedido ADD CONSTRAINT fk_EstadoPedido_Pedido FOREIGN KEY (pedido_id)
    REFERENCES Pedido (id);

-- Reference: Estado_Pedido_Usuario (table: Estado_Pedido)
ALTER TABLE Estado_Pedido ADD CONSTRAINT fk_EstadoPedido_Usuario FOREIGN KEY (usuario_id)
    REFERENCES Usuario (id);

-- Reference: FK_0 (table: Subrubro)
ALTER TABLE Subrubro ADD CONSTRAINT fk_Subrubro_Rubro FOREIGN KEY (rubro_id)
    REFERENCES Rubro (id);

-- Reference: FK_1 (table: Producto)
ALTER TABLE Producto ADD CONSTRAINT fk_Producto_Subrubro FOREIGN KEY (subrubro_id)
    REFERENCES Subrubro (id);

-- Reference: FK_13 (table: Sucursal_Productos)
ALTER TABLE Sucursal_Productos ADD CONSTRAINT fk_SucursalProducto_Producto FOREIGN KEY (producto_id)
    REFERENCES Producto (id) ON DELETE CASCADE;

-- Reference: FK_14 (table: Sucursal_Productos)
ALTER TABLE Sucursal_Productos ADD CONSTRAINT fk_SucursalProducto_Sucursal FOREIGN KEY (sucursal_id)
    REFERENCES Sucursal (id);

-- Reference: FK_2 (table: Pedido)
ALTER TABLE Pedido ADD CONSTRAINT fk_Pedido_Cliente FOREIGN KEY (cliente_id)
    REFERENCES Cliente (id);

-- Reference: FK_4 (table: Pedido)
ALTER TABLE Pedido ADD CONSTRAINT fk_Pedido_Entrega FOREIGN KEY (modo_entrega_id)
    REFERENCES Modo_Entrega (id);

-- Reference: FK_5 (table: Pedido_Productos)
ALTER TABLE Pedido_Productos ADD CONSTRAINT fk_PedidoProducto_Pedido FOREIGN KEY (pedido_id)
    REFERENCES Pedido (id);

-- Reference: FK_6 (table: Pedido_Productos)
ALTER TABLE Pedido_Productos ADD CONSTRAINT fk_PedidoProducto_Producto FOREIGN KEY (producto_id)
    REFERENCES Producto (id);

-- Reference: FK_7 (table: Usuario)
ALTER TABLE Usuario ADD CONSTRAINT fk_Usuario_Rol FOREIGN KEY (rol_id)
    REFERENCES Rol (id);

-- Reference: FK_8 (table: Sucursal)
ALTER TABLE Sucursal ADD CONSTRAINT fk_Sucursal_Status FOREIGN KEY (status_sucursal_id)
    REFERENCES Status_Sucursal (id);

-- Reference: FK_9 (table: Sucursal)
ALTER TABLE Sucursal ADD CONSTRAINT fk_Sucursal_Comercio FOREIGN KEY (comercio_id)
    REFERENCES Comercio (id);

-- Reference: Usuario_Sucursal (table: Usuario)
ALTER TABLE Usuario ADD CONSTRAINT fk_Usuario_Sucursal FOREIGN KEY (sucursal_id)
    REFERENCES Sucursal (id);

-- End of file.

CREATE OR REPLACE FUNCTION producto_imagen_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.orden IS NULL THEN
    SELECT COALESCE(MAX(orden) + 1, 1) INTO NEW.orden
    FROM Producto_Imagen WHERE producto_id = NEW.producto_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM Producto_Imagen
    WHERE producto_id = NEW.producto_id AND is_principal = TRUE
  ) THEN
    NEW.is_principal := TRUE;
    IF NEW.orden IS NULL OR NEW.orden > 1 THEN
      NEW.orden := 1;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_producto_imagen_defaults ON Producto_Imagen;
CREATE TRIGGER trg_producto_imagen_defaults
BEFORE INSERT ON Producto_Imagen
FOR EACH ROW EXECUTE FUNCTION producto_imagen_defaults();

CREATE OR REPLACE FUNCTION producto_imagen_promote_after_delete()
RETURNS TRIGGER AS $$
DECLARE
  _tiene_principal BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM Producto_Imagen
    WHERE producto_id = OLD.producto_id AND is_principal = TRUE
  ) INTO _tiene_principal;

  IF NOT _tiene_principal THEN
    UPDATE Producto_Imagen
    SET is_principal = TRUE
    WHERE id = (
      SELECT id FROM Producto_Imagen
      WHERE producto_id = OLD.producto_id
      ORDER BY orden ASC
      LIMIT 1
    );
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_producto_imagen_promote_after_delete ON Producto_Imagen;
CREATE TRIGGER trg_producto_imagen_promote_after_delete
AFTER DELETE ON Producto_Imagen
FOR EACH ROW EXECUTE FUNCTION producto_imagen_promote_after_delete();

CREATE OR REPLACE FUNCTION producto_imagen_ensure_single_principal()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_principal = TRUE THEN
        UPDATE Producto_Imagen
        SET is_principal = FALSE
        WHERE producto_id = NEW.producto_id
        AND id <> NEW.id
        AND is_principal = TRUE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_producto_imagen_ensure_single_principal ON Producto_Imagen;
CREATE TRIGGER trg_producto_imagen_ensure_single_principal
BEFORE UPDATE ON Producto_Imagen
FOR EACH ROW EXECUTE FUNCTION producto_imagen_ensure_single_principal();

CREATE OR REPLACE FUNCTION update_stock_producto()
RETURNS TRIGGER AS $$
DECLARE
    v_producto_id INT;
    v_sucursal_id INT;
    v_cantidad_diff INT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_producto_id := NEW.producto_id;
        v_cantidad_diff := NEW.cantidad;
    ELSIF TG_OP = 'UPDATE' THEN
        v_producto_id := NEW.producto_id;
        v_cantidad_diff := NEW.cantidad - OLD.cantidad;
    ELSIF TG_OP = 'DELETE' THEN
        v_producto_id := OLD.producto_id;
        v_cantidad_diff := -OLD.cantidad;
    END IF; 
    UPDATE Sucursal_Productos
    SET stock = stock - v_cantidad_diff
    WHERE producto_id = v_producto_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_stock_producto ON Pedido_Productos;
CREATE TRIGGER trg_update_stock_producto
AFTER INSERT OR UPDATE OR DELETE ON Pedido_Productos
FOR EACH ROW
EXECUTE FUNCTION update_stock_producto();

-- =====================
-- Vista de portada
-- =====================

CREATE OR REPLACE VIEW Producto_Portada AS
SELECT
    p.id AS producto_id,
    COALESCE(pi_principal.url, pi_first.url) AS cover_url
FROM Producto p
LEFT JOIN LATERAL (
    SELECT url
    FROM Producto_Imagen
    WHERE producto_id = p.id AND is_principal = TRUE
    LIMIT 1
    ) pi_principal ON TRUE
LEFT JOIN LATERAL (
    SELECT url
    FROM Producto_Imagen
    WHERE producto_id = p.id
    ORDER BY orden ASC
    LIMIT 1
) pi_first ON TRUE;


-- Poblate
insert into Cliente (domicilio, telefono, nombre) VALUES ('Martín Miguel de Güemes 3301, B7600 Mar del Plata, Provincia de Buenos Aires', 999, 'Cliente Genérico');
insert into Modo_Entrega (descripcion) VALUES ('delivery'), ('take away');
insert into Rol (descripcion) VALUES ('administrador'), ('superusuario'), ('usuario');
insert into Comercio (razon_social, cuit, nombre_fantasia) VALUES ('UZCUDUN COFFEE RIDE S.A.S.', '23453981649', 'UZCUDUN COFFEE RIDE');
insert into Status_Sucursal (nombre) values ('abierto');
insert into Sucursal (nombre, domicilio_calle, domicilio_nro, domicilio_piso, domicilio_dpto, telefono, status_sucursal_id, comercio_id) VALUES ('UZCUDUN COFFEE RIDE', 'Martín Miguel de Güemes 3301, B7600 Mar del Plata, Provincia de Buenos Aires', 3301, 0, 0, 0, 1, 1);
insert into usuario (email, pass, nombre, apellido, rol_id, sucursal_id) values ('juanjosemolfese@gmail.com', '$2b$10$ePSMAkri6aBL3MvuKzTD5u6fhlebgRb9ZrMWFHXMUiDN4odElQSgW', 'juan', 'molfese', 2, 1), ('fdcrespi@gmail.com', '$2b$10$o0K7G1PPunZloZqxrwvToeHE9bxerMKUbHsHiBHq3/qs9.PDVuzQG', 'federico', 'crespi', 2, 1);

COMMIT;