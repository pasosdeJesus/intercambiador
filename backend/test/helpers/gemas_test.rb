# frozen_string_literal: true

require_relative "../test_helper"

class GemasTest < ActionView::TestCase

  setup do
    @hmac_secret = "secret"
  end

  test "cif-dec-hs256" do
    carga = { datos: 'probando' }
    testigo = JWT.encode carga, @hmac_secret, 'HS256'

    puts testigo

    descifrado = JWT.decode testigo, @hmac_secret, true, { algorithm: 'HS256' }
    puts descifrado
    assert_equal descifrado[0][:datos], carga["datos"]
  end

  test "cif-dec-hs256-timeout" do
    exp = Time.now.to_i + 1 * 3600 # 1 hora
    puts exp
    carga = { 
      "address"=> 
      "0:82e958aa8dfad967ca95556f54e69581d6531699060f72b10cad91a7c1f38bc7",
      "exp"=> exp
    }
    testigo = JWT.encode carga, @hmac_secret, 'HS256'

    puts testigo

    descifrado = JWT.decode testigo, @hmac_secret, true, { algorithm: 'HS256' }
    puts descifrado
    assert_equal descifrado[0][:datos], carga["datos"]

  end

end  # class
