require_relative "../test/test_helper"

if (Usuario.where(id: 2).count == 0)
  usuario = Usuario.create! PRUEBA_USUARIO.merge(
    id: 2
  )
  anuncio = Anuncio.new PRUEBA_ANUNCIO.merge(
    id: 1,
    usuario_id: 2
  )
  anuncio.usuario_id = usuario.id
  anuncio.save!
end


if (Usuario.where(id: 3).count == 0)
  usuario2 = Usuario.create! PRUEBA_USUARIO.merge(
    id: 3,
    nusuario: 'miguel_rojas',
    nombre: 'Miguel Rojas',
    descripcion: 'Cambios Super',
    email: 'miguelrojas@localhost'
  )
  anuncio2 = Anuncio.new PRUEBA_ANUNCIO.merge(
    id: 2,
    ton: 20,
    margenflotante: 104,
    limiteinferior: 10,
    maximotiempo: 100,
    usuario_id: 3
  )
  anuncio2.usuario_id = usuario2.id
  anuncio2.save!
end
