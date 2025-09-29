-- tables
-- Table: Cliente
CREATE TABLE Cliente (
    id SERIAL PRIMARY KEY ,
    domicilio varchar(150)  NOT NULL,
    telefono int  NOT NULL,
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
    payer_first_name varchar(50)  NULL,
    payer_address varchar(150)  NULL,
    total float NOT NULL
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
    image varchar(255)  NULL,
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

-- Poblate
insert into Rol (descripcion) VALUES ('administrador'), ('superusuario'), ('usuario');
insert into Comercio (razon_social, cuit, nombre_fantasia) VALUES ('UZCUDUN COFFEE RIDE S.A.S.', '23453981649', 'UZCUDUN COFFEE RIDE');
insert into Status_Sucursal (nombre) values ('abierto');
insert into Sucursal (nombre, domicilio_calle, domicilio_nro, domicilio_piso, domicilio_dpto, telefono, status_sucursal_id, comercio_id) VALUES ('UZCUDUN COFFEE RIDE', 'Martín Miguel de Güemes 3301, B7600 Mar del Plata, Provincia de Buenos Aires', 3301, 0, 0, 0, 1, 1);
insert into usuario (email, pass, nombre, apellido, rol_id, sucursal_id) values ('juanjosemolfese@gmail.com', 'juanjo', 'juan', 'molfese', 2, 1), ('fdcrespi@gmail.com', 'federico', 'federico', 'crespi', 2, 1);