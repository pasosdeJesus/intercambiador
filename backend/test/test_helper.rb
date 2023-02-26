ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Add more helper methods to be used by all tests here...
end

# To reduce problems with fixtures we leave examples in this file

PRUEBA_ANUNCIO = {
  ton: 10,
  margenflotante: 102,
  limiteinferior: 5,
  maximotiempo: 100,
  usuario_id: 1,
  created_at: '2023-02-25',
  updated_at: '2023-02-25',
}


PRUEBA_USUARIO = {
  nusuario: "juan_perez",
  password: "sjrven123",
  nombre: "Juan Perez",
  descripcion: "Juan Perez",
  rol: 5,
  idioma: "es_CO",
  email: "juanperez@localhost",
  encrypted_password: '$2a$10$uMAciEcJuUXDnpelfSH6He7BxW0yBeq6VMemlWc5xEl6NZRDYVA3G',
  sign_in_count: 0,
  fechacreacion: '2023-02-25',
  fechadeshabilitacion: nil,
  created_at: '2023-02-25',
  updated_at: '2023-02-25',
}
