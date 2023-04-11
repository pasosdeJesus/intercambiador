class ActualizaAnunciosventaJob < ApplicationJob
  queue_as :default

  # Espera varios segundos examinando el listado de anuncios de venta
  # revisando si en base de datos debe agregarse uno para la dirección
  # que recibe
  def perform(direccion, horainicial)
    #puts "Esperar varios segundos revisando en blockchain si hay nuevo anuncio para #{direccion} y en tal caso agregarlo a base de datos"

    res = `(cd ../scripts; npx ts-node get_selling_ad #{direccion})`
    puts res
    coins = res.match(/{ coins: (.*), valid_until: (.*) }/)[1]
    valid_until = res.match(/{ coins: (.*), valid_until: (.*) }/)[2]
    if (coins && valid_until)
      # Agregar a base de datos
      usuario = Usuario.where(direccion: direccion).take
      if !usuario
        puts "Problema, no se encontró usuario con dirección #{direccion}"
        return
      end
      if Anuncioventa.where(usuario_id: usuario.id).count > 0
        puts "Problema, usuario #{usuario.id} ya tiene anuncio";
        return
      end
      a = Anuncioventa.create(
        ton: coins,
        margenflotante: 104,
        limiteinferior: 5.2,
        maximotiempo: 15,
        usuario_id: usuario.id
      )
      if !a.save
        puts "Problema, no pudo crear anuncio";
        puts a.errors.messages
        return
      end
    else
      if Time.now()-horainicial < 10
        sleep(1)
        ActualizaAnunciosventaJob.perform_later(direccion, horainicial)
      end
    end
  end
end
