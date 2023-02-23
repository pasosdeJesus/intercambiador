conexion = ActiveRecord::Base.connection();

Msip::carga_semillas_sql(conexion, "msip", :datos)

conexion.execute("INSERT INTO public.usuario
  (id, nusuario, email, encrypted_password, password,
  fechacreacion, created_at, updated_at, rol)
  VALUES (1, 'msip', 'msip@localhost',
  '$2a$10$WphwnqY9mO/vGcIEUuWVquetUqBd9kqcbnUFmxpbPuYRUs8FwdArW',
  '', '2022-09-30', '2022-09-30', '2022-09-30', 1);")
